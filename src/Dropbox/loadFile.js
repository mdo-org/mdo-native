import { Dropbox } from "dropbox";

const readFileBlob = fileBlob =>
  new Promise((resolve, reject) => {
    try {
      const reader = new global.FileReader();
      reader.addEventListener("loadend", () => {
        resolve(reader.result);
      });
      reader.addEventListener("error", err => {
        reject(err);
      });
      reader.readAsText(fileBlob, "UTF-8");
    } catch (err) {
      reject(err);
    }
  });

export default async function dropboxLoadFile({ accessToken, path }) {
  const dropbox = new Dropbox({ fetch: global.fetch, accessToken });
  const response = await dropbox.filesDownload({ path });
  const { rev, fileBlob } = response;
  const text = await readFileBlob(fileBlob);
  return { rev, text };
}
