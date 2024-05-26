
### How to Use the Extension

1. **Add the Extension to Your Project:**
  You can include the Hype Snapshot Properties Extension by either linking it via CDN or downloading it from the GitHub repository.

  - **Option A: Content Delivery Network (CDN)**
    The latest version can be linked into your project using the following in the head section of your project:
    ```html
    <script src="https://cdn.jsdelivr.net/gh/yourusername/HypeSnapshotProps/HypeSnapshotProps.min.js"></script>
    ```
    
  - **Option B: Download from GitHub**
    * Go to the Hype Snapshot Properties Extension GitHub Repository.
    *  Download the latest version of `HypeSnapshotProps.js` or `HypeSnapshotProps.min.js`.
    * Place the downloaded `HypeSnapshotProps.js` or `HypeSnapshotProps.min.js` file in your Hype project's resources folder.

2. **Set `data-snapshot-props` Attribute:**
   - Add the `data-snapshot-props` attribute to any element you want to track. 
   - Example: `data-snapshot-props` the value defaults to `top,left` but you can also specify props like `top,left,width`

3. **Trigger Updates Manually:**
   - Use `hypeDocument.snapshotProps(selectorOrElement)` to manually snapshot the properties.
   - Example: `hypeDocument.snapshotProps(hypeDocument.getElementById('myElement'));`
   - Example: `hypeDocument.snapshotProps('.myElements');`
   - Example: `hypeDocument.snapshotProps();` (Snapshots all elements with `data-snapshot-props` in the current scene)
   - Example: `hypeDocument.snapshotProps(hypeDocument.getElementById('myElement'), { top: 100, left: 200 })`;

4. **Restore Properties with Optional Overrides:**
   - Use `hypeDocument.restoreProps(selectorOrElement, options)` to restore a specific element's properties or all elements matching the selector with optional overrides.
   - Example: `hypeDocument.restoreProps(hypeDocument.getElementById('myElement'), { duration: 2, easing: 'linear' });`
   - Example: `hypeDocument.restoreProps('.myElements', { duration: 0.5, easing: 'easeout' });`
   - Example: `hypeDocument.restoreProps();` (Restores all elements with `data-snapshot-props` in the current scene)

### Explanation

- **Defaults:**
  The default properties to be tracked are `top` and `left`, with a default duration of 1 second for general defaults and 0.5 seconds for individual calls. Easing is set to 'easeinout' by default. These can be changed using the `setDefault` method.

- **Document Load:**
  During the `HypeDocumentLoad` event, the `snapshotProps` and `restoreProps` functions are added to the `hypeDocument` object, making them available for manual updates and resets.

- **Scene Preparation:**
  During the `HypeScenePrepareForDisplay` event, the extension will look for all elements with the `data-snapshot-props` attribute and snapshot the specified properties.

- **Snapshot Properties:**
  The `snapshotProps` function can take either a selector string or an individual element to snapshot the properties. If called without parameters, it snapshots all elements with `data-snapshot-props` in the current scene.

- **Restore Properties with Overrides:**
  The `restoreProps` function can take either a selector string or an individual element to restore the properties using the stored data attributes, with duration and easing specified by `data-snapshot-duration` and `data-snapshot-ease` attributes or their defaults. Optional overrides for duration, easing, and properties can be passed via the `options` object. Calling `hypeDocument.restoreProps()` without arguments will restore all elements with `data-snapshot-props` in the current scene.

