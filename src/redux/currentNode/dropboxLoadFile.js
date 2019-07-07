import { Dropbox } from "dropbox";
import MDo from "@mdo-org/mdo-core/lib/strings";
import { BlockHelper } from "@mdo-org/mdo-core";

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

// I'm getting rid of PADDING blocks and converting each block to a string, to
// make manipulation easier.
// In a future implementation, I might pass the whole Block object instead, to
// implement things like tag highlighting/editing, etc.
const parse = async text => {
  const blocks = await MDo.parse(text);
  return blocks
    .filter(({ type }) => type !== "PADDING")
    .map(BlockHelper.toString);
};

export default async function dropboxLoadFile({ accessToken, path }) {
  const dropbox = new Dropbox({ fetch: global.fetch, accessToken });
  const response = await dropbox.filesDownload({ path });
  const { rev, fileBlob } = response;
  const text = await readFileBlob(fileBlob);
  const contents = await parse(text);
  return { rev, contents };
}
