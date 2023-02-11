# VSCode Advanced snippets

> [VSCode](http://code.visualstudio.com) extension to manage snippets in an easy way.

[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/brpaz/vscode-docsearch/CI?style=for-the-badge)]()
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/brpaz.vscode-docsearch?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=brpaz.docsearch)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/b?style=for-the-badge)](https://img.shields.io/visual-studio-marketplace/i/brpaz.docsearch?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=brpaz.vscode-docsearch)


## Demo

![Extension Demo](demo.gif)

## Features

- Manage snippets directly from the VSCode interface using the Explorer.
- Configure advanced conditions to trigger the snippets (Ex: File pattern, NPM Package, etc).
- Snippets are stored in a yaml file, by snippet, in a format similar to a Kubernetes CRD, making it a lot easier to read and edit, that the original VSCode snippets format.

Here is an example of a snippet file:

```yaml
apiVersion: snippets.brunopaz.dev/v1
kind: Sniipet
metadata:
    name: my-snippet
spec:
    body: |
        console.log("Hello world")
    conditions:
        language: javascript
        file_patterns:
            - "**/**/myfile.js"
        packages:
            - format: npm
            - name: react
```

## Getting started


### Installation

Launch VS Code Quick Open (`Ctrl+P`), paste the following command, and press enter.

```sh
ext install brpaz.vscode-advanced.snippets
```

## Usage

### Creating a snippet

This extension have 3 different ways to create a snippet:

- Using the `create snippet command`
- Create from the existing selection.
- From the Explorer view.

A





## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Author

👤 **Bruno Paz**

* Website: [brunopaz.dev](https://brunopaz.dev)
* Github: [@brpaz](https://github.com/brpaz)


## 💛 Support the project

If this project was useful to you in some form, I would be glad to have your support.  It will help to keep the project alive and to have more time to work on Open Source.

The sinplest form of support is to give a ⭐️ to this repo.

You can also contribute with [GitHub Sponsors](https://github.com/sponsors/brpaz).

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-Sponsor%20Me-red?style=for-the-badge)](https://github.com/sponsors/brpaz)


Or if you prefer a one time donation to the project, you can simple:

<a href="https://www.buymeacoffee.com/Z1Bu6asGV" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>


## Disclaimer

The default documentation included in this extension contains a few API keys and APP Ids for Aloglia DocSearch projects. They are publically avaibable and not secret at all.

## 📝 License


Copyright © 2022 [Bruno Paz](https://github.com/brpaz).

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

<a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Vectors Market - Flaticon</a>
