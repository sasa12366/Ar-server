// utils.js
export const createUniqueFolder = (baseDir) => {
    let uniqueFolderName;
    do {
        uniqueFolderName = `content_${Date.now()}`;
    } while (fs.existsSync(path.join(baseDir, uniqueFolderName)));
    const uniqueFolderPath = path.join(baseDir, uniqueFolderName);
    fs.mkdirSync(uniqueFolderPath);
    return uniqueFolderPath;
};
