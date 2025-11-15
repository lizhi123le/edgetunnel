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
  controlFlowFlattening: false,
  controlFlowFlatteningThreshold: 0,
  deadCodeInjection: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 1.0,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: false,
  stringArrayWrappersParametersMaxCount: 3,
  renameGlobals: true,
  identifierNamesGenerator: 'mangled-shuffled',
  identifierNamesCache: null,
  identifiersPrefix: '',
  renameProperties: false,
  renamePropertiesMode: 'safe',
  ignoreImports: false,
  target: 'browser',
  numbersToExpressions: false,
  simplify: false,
  splitStrings: true,
  splitStringsChunkLength: 1,
  transformObjectKeys: false,
  unicodeEscapeSequence: true,
  selfDefending: false,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  domainLock: []
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







