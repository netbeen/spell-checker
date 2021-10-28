const fs = require("fs");
const path = require("path");
const Typo = require("typo-js");

const directoryOrFileBlackList = [
    '.git', '.idea', '.npmignore', '__snapshots__', 'icon.icns', '.gitignore', '.vscode',
    'monorepo.code-workspace', '.changeset', '.editorconfig', '.nvmrc', 'package.json',
    'docs.css', 'tsconfig.json',
];
const dictionary = new Typo('en_US');
const wordWhiteList = [
    'https', 'changelog', 'jsx', 'src', 'const', 'foo', 'args', 'req',
    'modernjs', 'href', 'typeof', 'eslint', 'browserslist', 'js', 'cjs', 'mjs', 'ejs', 'esm',
    'url', 'config', 'html', 'dev', 'async', 'workflow', 'commonjs', 'dir', 'fs', 'http', 'os', 'ipv',
    'entrypoints', 'plugin', 'pre', 'app', 'nestjs', 'readonly', 'ctx', 'ssr', 'ssg', 'app',
    'esbuild', 'crypto', 'outfile', 'plugins', 'filepath', 'namespace', 'middleware', 'func', 'lang',
    'rc', 'sublicense', 'br', 'frontend', 'chinese', 'fd', 'json', 'english', 'env', 'rollup', 'wasm',
    'api', 'monorepo', 'pnpm', 'prepublish', 'webpack', 'yaml', 'css', 'utils', 'pwd', 'fn', 'compat',
    'dotfile', 'utf', 'params', 'tsconfig', 'nex', 'babelrc', 'lerna', 'dag', 'urls', 'dirs', 'npm',
    'viewport', 'facebook', 'param', 'esmpack', 'cwd', 'echarts', 'inline', 'dirname', 'cd', 'mwa', 'lodash',
    'postcss', 'sourcemap', 'ret', 'entrypoint', 'enum', 'keyof', 'ast', 'java', 'loc', 'arg', 'regex',
    'upath', 'sep', 'pv', 'execa', 'configs', 'macos', 'ubuntu', 'debian', 'init', 'cli', 'eslintrc', 'pid', 'todo',
    'zsh', 'commitlint', 'jsnext', 'antd', 'polyfill', 'amd', 'umd', 'systemjs', 'deps', 'regenerator', 'corejs',
    'esmodules', 'semver', 'instanceof', 'msg', 'xhtml', 'str', 'gzip', 'gzipped', 'filesize', 'querystring', 'ip',
    'impl', 'middlewares', 'bff', 'koa', 'unbundle', 'refactor', 'zh', 'schemas', 'ico', 'svg', 'jpg', 'jpeg', 'tsx',
    'firefox', 'ios', 'namespaces', 'nodejs', 'scss', 'usr', 'ajv', 'chokidar', 'argv', 'unhandled', 'md', 'dotenv',
    'interop', 'ansi', 'chao', 'xu', 'util', 'qs', 'rootpath', 'len', 'javascript', 'autoprefixer', 'flexbox',
    'de', 'filesystem', 'readdir', 'noscript', 'wx', 'memfs', 'xuchaobei', 'posix', 'workflows', 'cacheable', 'diff',
    'tmp', 'envs', 'dep', 'ws', 'idx', 'acc', 'ua', 'axios', 'lru', 'devcert', 'exts', 'htm', 'tj', 'noop', 'preid',
    'stdin', 'stdout', 'stderr', 'wp', 'mdx', 'fallback', 'github', 'unist', 'docsite', 'lifecycle', 'freezed',
    'linting', 'bugfixes', 'basename', 'emoji', 'webkit', 'xmlns', 'treeshaking', 'logtext', 'unknow', 'jupiter',
    'metas', 'dists', 'esnext', 'sourcefile', 'devtool', 'codeframe', 'childprocess', 'stylelint',
    'hotfix', 'microfrontend', 'ethernet', 'getwebproxy', 'networksetup', 'localhost', 'jsdom', 'proto', 'metadata',
    'sourcemaps', 'tslib', 'snowpack', 'polyfills', 'cheng', 'builtin', 'renderlevel', 'prefetch', 'nossr', 'immer',
    'redux', 'devtools', 'findup', 'addons', 'zrender', 'extname', 'downlevel'
];

const splitCamelcaseToWords = function (string) {
    return string.split(/(?=[A-Z])/g);
};

const traverseFileInDirectory = (dirFullName) => {
    const fullPathList = [];
    const arr = fs.readdirSync(dirFullName);
    arr.forEach(function(subPath){
        if(directoryOrFileBlackList.find((blackListItem)=>(blackListItem.includes(subPath)))){
            return;
        }
        const fullPath = path.join(dirFullName,subPath);
        if(fs.statSync(fullPath).isDirectory()){
            fullPathList.push(...traverseFileInDirectory(fullPath));
        }else{
            fullPathList.push(fullPath);
        }
    });
    return fullPathList;
}

const readFileAndCheckSpell = (fullPath) => {
    const lines = fs.readFileSync(fullPath).toString().split('\n');
    lines.forEach((line, index)=> {
        const words = line
            .split(' ')
            .map((word) => (
                word.match(/[a-zA-Z]+/)?.[0].replace(/_/g, '') ?? ''
            ))
            .map((word)=>(splitCamelcaseToWords(word)))
            .flat()
            .map((word)=>(word.toLowerCase()));
        words.forEach((word)=>{
            if(wordWhiteList.includes(word) || word.length < 5){
               return;
            }
            if(!dictionary.check(word)){
                console.log(`${fullPath}:${index} ${word}`);
            }
        });
    })
};

const fileList = traverseFileInDirectory("/Users/bytedance/modern.js");
fileList.forEach((file) => {
    readFileAndCheckSpell(file)
});
