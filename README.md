# Unix Timestamp Converter

![Icon](/icons/icon128.png)

A Chrome extension for quick and convenient Unix timestamp conversions directly in your browser.

## Overview

This extension helps developers, data analysts, and system administrators instantly convert Unix timestamps to human-readable dates and vice versa. With its intuitive interface and powerful features, it eliminates the need to visit external websites for timestamp conversions.

## Features

- **Bidirectional Conversion**: Convert between Unix timestamps and readable dates instantly
- **Multiple Time Units**: Support for seconds and milliseconds
- **Flexible Date Formats**: ISO 8601, Human Readable, UTC String, and Locale String options
- **Time Zone Control**: UTC, Local, and Custom timezone options with offset selection
- **Quick Actions**: 
  - "Set Current Time" button for immediate timestamp generation
  - Copy functionality for all converted values
- **Conversion History**: Track recent conversions for reference
- **Dark/Light Theme**: Comfortable viewing in any environment

## Screenshots

*Screenshots will be added soon*

## Installation

### From Chrome Web Store
*Coming soon*

### Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your browser toolbar

## Usage

1. Click the extension icon in your browser toolbar
2. Enter a Unix timestamp or set date/time values
3. View the conversion results instantly
4. Copy the converted values with a single click
5. Switch between time units, date formats, and timezones as needed

## Technical Details

Built with vanilla JavaScript for optimal performance, this extension maintains a minimal footprint while providing essential timestamp conversion functionality directly in your browser.

## Development

### Project Structure
- `js/` - JavaScript modules (theme, timezone, timestamp, ui, main, history)
- `css/` - CSS modules (base, theme, components, layout)
- `icons/` - Extension icons in different sizes
- `tools/` - Development utilities

### Icon Generation
The extension icons are generated programmatically using the Canvas API:

```bash
# Install dependencies
npm install

# Generate icons
npm run generate-icons
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Maksim Samokhin - [samokhyn@gmail.com](mailto:samokhyn@gmail.com)

## Acknowledgments

- Thanks to all contributors who help improve this extension
- Inspired by the need for a quick and efficient timestamp conversion tool
