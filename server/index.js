import express from 'express';
import multer from 'multer';
import path from 'node:path';
import process from 'node:process';
import * as XLSX from 'xlsx';

const app = express();
const port = Number(process.env.PORT || 3001);
const allowedExtensions = new Set(['.xlsx', '.xls', '.csv']);
const upload = multer({
  storage: multer.memoryStorage(),
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/uploads/parse', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file was uploaded. Select an .xlsx, .xls, or .csv file and try again.',
      });
    }

    const extension = path.extname(req.file.originalname || '').toLowerCase();

    if (!allowedExtensions.has(extension)) {
      return res.status(400).json({
        error: 'Unsupported file format. Only .xlsx, .xls, and .csv files are allowed.',
      });
    }

    const workbookPayload = parseWorkbook(req.file.buffer, req.file.originalname, extension);

    return res.json(workbookPayload);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'The uploaded file could not be parsed. Verify the file structure and try again.',
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.use((error, _req, res, _next) => {
  return res.status(500).json({
    error: 'The server could not process the request.',
  });
});

app.listen(port, () => {
  console.log(`FactoryOS upload API listening on http://localhost:${port}`);
});

function parseWorkbook(buffer, fileName, extension) {
  const workbook = XLSX.read(buffer, {
    type: 'buffer',
    raw: true,
    dense: true,
    cellDates: true,
  });

  if (!workbook.SheetNames.length) {
    throw new Error('The uploaded workbook does not contain any sheets.');
  }

  const sheets = workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    return parseSheet(sheetName, worksheet);
  }).filter((sheet) => sheet.rowCount > 0);

  if (!sheets.length) {
    throw new Error('The uploaded file does not contain a header row followed by data rows.');
  }

  return {
    fileName,
    fileExtension: extension,
    fileSize: buffer.length,
    parsedAt: new Date().toISOString(),
    sheets,
  };
}

function parseSheet(sheetName, worksheet) {
  const matrix = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: true,
    defval: null,
    blankrows: false,
  });

  if (!matrix.length) {
    return {
      name: sheetName,
      columns: [],
      rows: [],
      rowCount: 0,
      columnCount: 0,
      emptyCellCount: 0,
    };
  }

  const headerRow = matrix[0];
  const headers = headerRow.map((value) => stringifyHeader(value));

  if (!headers.length || headers.every((header) => !header)) {
    throw new Error(`Sheet "${sheetName}" is missing a valid header row.`);
  }

  const blankHeaderIndex = headers.findIndex((header) => !header);
  if (blankHeaderIndex !== -1) {
    throw new Error(`Sheet "${sheetName}" contains a blank header in column ${blankHeaderIndex + 1}.`);
  }

  const duplicates = findDuplicateHeaders(headers);
  if (duplicates.length) {
    throw new Error(`Sheet "${sheetName}" contains duplicate headers: ${duplicates.join(', ')}.`);
  }

  const rows = matrix
    .slice(1)
    .map((row) => headers.map((_, index) => serializeCellValue(row[index] ?? null)));

  const nonEmptyRows = rows.filter((row) => row.some((value) => !isEmptyValue(value)));

  if (!nonEmptyRows.length) {
    return {
      name: sheetName,
      columns: headers.map((header, index) => ({
        index,
        header,
        inferredType: 'categorical',
        emptyCount: 0,
        nonEmptyCount: 0,
        uniqueCount: 0,
      })),
      rows: [],
      rowCount: 0,
      columnCount: headers.length,
      emptyCellCount: 0,
    };
  }

  const columns = headers.map((header, index) => inferColumnMetadata(header, index, nonEmptyRows));
  const emptyCellCount = nonEmptyRows.reduce(
    (total, row) => total + row.filter((value) => isEmptyValue(value)).length,
    0
  );

  return {
    name: sheetName,
    columns,
    rows: nonEmptyRows,
    rowCount: nonEmptyRows.length,
    columnCount: headers.length,
    emptyCellCount,
  };
}

function inferColumnMetadata(header, index, rows) {
  let numericCount = 0;
  let dateCount = 0;
  let booleanCount = 0;
  let emptyCount = 0;
  let nonEmptyCount = 0;
  const uniqueValues = new Set();

  for (const row of rows) {
    const value = row[index];

    if (isEmptyValue(value)) {
      emptyCount += 1;
      continue;
    }

    nonEmptyCount += 1;
    uniqueValues.add(stableValueKey(value));

    const detectedType = detectCellType(value);

    if (detectedType === 'number') {
      numericCount += 1;
      continue;
    }

    if (detectedType === 'boolean') {
      booleanCount += 1;
      continue;
    }

    if (detectedType === 'date') {
      dateCount += 1;
    }
  }

  return {
    index,
    header,
    inferredType: inferType({
      numericCount,
      dateCount,
      booleanCount,
      nonEmptyCount,
    }),
    emptyCount,
    nonEmptyCount,
    uniqueCount: uniqueValues.size,
  };
}

function inferType({ numericCount, dateCount, booleanCount, nonEmptyCount }) {
  if (nonEmptyCount === 0) {
    return 'categorical';
  }

  if (numericCount === nonEmptyCount) {
    return 'number';
  }

  if (dateCount === nonEmptyCount) {
    return 'date';
  }

  if (booleanCount === nonEmptyCount) {
    return 'boolean';
  }

  return 'categorical';
}

function serializeCellValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return value ?? null;
}

function stringifyHeader(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

function findDuplicateHeaders(headers) {
  const seen = new Set();
  const duplicates = new Set();

  headers.forEach((header) => {
    const normalized = header.toLowerCase();
    if (seen.has(normalized)) {
      duplicates.add(header);
      return;
    }
    seen.add(normalized);
  });

  return Array.from(duplicates);
}

function stableValueKey(value) {
  if (value === null || value === undefined) {
    return 'null';
  }

  return `${typeof value}:${String(value)}`;
}

function isEmptyValue(value) {
  return value === null || value === undefined || value === '';
}

function isIsoDateString(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && /^\d{4}-\d{2}-\d{2}/.test(value);
}

function detectCellType(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return 'number';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (typeof value !== 'string') {
    return 'categorical';
  }

  const trimmed = value.trim();

  if (trimmed === '') {
    return 'categorical';
  }

  if (/^(true|false)$/i.test(trimmed)) {
    return 'boolean';
  }

  if (!Number.isNaN(Number(trimmed)) && trimmed !== '') {
    return 'number';
  }

  if (isIsoDateString(trimmed)) {
    return 'date';
  }

  return 'categorical';
}
