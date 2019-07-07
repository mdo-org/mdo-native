export function isFile(state) {
  return !!(state.currentNode && state.currentNode.type === "file");
}

export function isDir(state) {
  return !!(state.currentNode && state.currentNode.type === "directory");
}

export function isRoot(state) {
  return !!(state.currentNode && state.currentNode.path === "");
}

export function getPath(state) {
  if (!state.currentNode) return null;
  return state.currentNode.path;
}

export function getType(state) {
  return state.currentNode && state.currentNode.type;
}

export function getContents(state) {
  if (!state.currentNode) return null;
  return state.currentNode.contents;
}
