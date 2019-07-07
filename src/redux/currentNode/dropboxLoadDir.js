import { Dropbox } from "dropbox";

const getFileType = entry => {
  const tag = entry[".tag"];
  if (tag === "file" && entry.is_downloadable) return "file";
  if (tag === "folder") return "directory";
  return "unknown";
};

export default async function dropboxLoadDir({ accessToken, path }) {
  const dropbox = new Dropbox({ fetch: global.fetch, accessToken });
  const { entries } = await dropbox.filesListFolder({ path });
  return entries.map(entry => ({
    type: getFileType(entry),
    path: entry.path_lower,
    name: entry.name
  }));
}
