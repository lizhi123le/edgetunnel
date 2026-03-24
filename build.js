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

// 混淆配置（适配 Cloudflare Workers）
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: false,
  controlFlowFlatteningThreshold: 0,
  deadCodeInjection: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.8,  // 降低阈值，只混淆80%的字符串
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,  // 减少包装器数量
  stringArrayWrappersChainedCalls: false,
  stringArrayWrappersParametersMaxCount: 2,
  renameGlobals: false,  // 禁用全局变量重命名，避免冲突
  identifierNamesGenerator: 'mangled',
  identifierNamesCache: null,
  identifiersPrefix: '',
  renameProperties: false,
  renamePropertiesMode: 'safe',
  ignoreImports: true,  // 忽略 import 语句
  target: 'node',
  numbersToExpressions: false,
  simplify: false,
  splitStrings: true,
  splitStringsChunkLength: 2,  // 增加分块长度
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  selfDefending: false,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: false,
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




