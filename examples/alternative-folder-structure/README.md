# Alternative Folder Structure

You can change the location of environment files by setting `paths.environment` in the config file. In this example, environment files are located besides component files. It's useful when you have a lot of components so you don't have to switch between components and environments folder.

```toml
[paths.environment]
component = "components/#{component}/#{environment}"
```
