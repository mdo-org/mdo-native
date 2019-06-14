# To-Do

- [ ] load the App.js `accessToken` from an env variable
  - I don't want to accidentally commit my accessToken
  - This is temporary - until I can actually implement dropbox login
- [ ] allow selecting a file
      In the `<FileNavigator/>` component, make each link clickable. On click, render the `<File>` component and pass along the file.
      Note: only actual files should be clickable (not directories). Directories should be implemented later.
