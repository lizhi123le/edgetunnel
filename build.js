const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 输入和输出文件路径
const inputFile = path.join(__dirname, './_worker_temp.js');
const outputFile = path.join(__dirname, './_worker.js');

// 确保输出目录存在
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取原始 worker 脚本
let code;
try {
  code = fs.readFileSync(inputFile, 'utf8');
} catch (err) {
  console.error(`Error reading input file: ${err.message}`);
  process.exit(1);
}

// 混淆配置（国家级安全级别）
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  stringArray: true,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayThreshold: 0.8,
  transformObjectKeys: true,
  rotateStringArray: true,
  shuffleStringArray: true,
  splitStrings: true,
  splitStringsChunkLength: 3,
  identifierNamesGenerator: 'mangled',
  renameGlobals: true,
  unicodeEscapeSequence: true,
  selfDefending: true,
  disableConsoleOutput: true,
  target: 'browser',
  numbersToExpressions: true,
  simplify: true,
  ignoreRequireImports: true,
  domainLock: [],
  sourceMap: false,
  sourceMapMode: 'separate'
};

// 执行混淆
try {
  const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
  // 写入混淆后的代码
  fs.writeFileSync(outputFile, obfuscationResult.getObfuscatedCode(), 'utf8');
  console.log(`Obfuscated code written to ${outputFile}`);
} catch (err) {
  console.error(`Error during obfuscation: ${err.message}`);
  process.exit(1);

}



