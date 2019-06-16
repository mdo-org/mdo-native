// File exposes helper methods to deal with Dropbox files

function isFile(file) {
  return file[".tag"] === "file";
}

function isReadableFile(file) {
  return file[".tag"] === "file" && file.is_downloadable;
}

function isDirectory(file) {
  return file[".tag"] === "folder";
}

function getPath(file) {
  return file.path_lower;
}

export { isFile, isReadableFile, isDirectory, getPath };
