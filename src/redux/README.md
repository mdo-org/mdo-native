App state:

```javascript
{
  isLoading: false,
  errors: [
    new Error('something happened'),
    new Error('another thing happened'),
  ],
  fileSystem: {
    type: 'dropbox',
    accessToken: 'foobar',
  },
  // for a file
  currentNode: {
    type: 'file',
    path: '/foo/bar.md',
    contents: ['hello', 'world'],
    isNew: false,
  }

  // for a directory
  currentNode: {
    path: '/foo',
    type: 'dir',
    contents: [
      { type: 'file', path: '/foo/bar.md' }
    ]
  }
}
```

App actions that can be triggered from the UI:

```javascript
fileSystem.actions.useDropbox(); // mounts Dropbox as the file system, triggers the dropbox login process, triggers loading of the root directory
fileSystem.actions.openDir("/hello"); // navigates to a new directory in the fileSystem and loads its contents
fileSystem.actions.openFile("/hello/world.md"); // navigates to a new file in the fileSystem and loads its contents

// file actions
currentNode.actions.updateContents(["hello", "world"]); // updates the file's contents
currentNode.actions.runMDo(); // runs MDo on the current file. updates the file's contents
currentNode.actions.save(); // persist changes to file system
currentNode.actions.reload({ saveChanges: true }); // loads the file from the file system. if saveChanges is true, will run save() before loading

// directory actions
currentNode.actions.addFile({ name: "baz.md", contents: [] }); // adds a new file to the directory
```
