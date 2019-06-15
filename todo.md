# To-Do

- [ ] implement dropbox login
  - figure out how to save the token into localstorage, and read it on load.
  - add a logout option
- [ ] allow selecting a file
      In the `<FileNavigator/>` component, make each link clickable. On click, render the `<File>` component and pass along the file.
      Note: only actual files should be clickable (not directories). Directories should be implemented later.
