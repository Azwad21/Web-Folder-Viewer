class TreeViewFolder {
    constructor(treeElm, rootFolderName = "root folder") {
        this.elm = treeElm;
        this.rootFolderName = rootFolderName;


        this.define()
        this.initialize(12);
    }

    define() {
        this.toolbar = this.elm.querySelector("div.toolbar");
        this.containers = this.elm.querySelectorAll("div.tree div.container");
        this.firstContainer = this.elm.querySelector("div.tree > div.container");
        this.subviews = this.elm.querySelectorAll("div.tree div.subview");
        this.folders = this.elm.querySelectorAll("div.tree div.folder.view-element");
        this.files = this.elm.querySelectorAll("div.tree div.file.view-element");
        this.viewElements = this.elm.querySelectorAll("div.tree div.view-element");
    }

    initialize(margin) {
        this.setToolbarElement();
        this.setFolderIcons("bi-folder-fill");
        this.setCarets();
        this.setFileIcons();
        this.retrieveCaretAndIconBoundings(margin)
        this.setComputedStyles();
        this.addEvents();
        this.addIndicator();
    }

    setCarets() {
        if (this.folders) {
            this.folders.forEach(folder => {
                if (folder.querySelector("span.caret")) return
                folder.insertAdjacentElement("afterbegin", this.createCaret())
            })
        }
    }

    setFolderIcons(iconClassName = "bi-folder-fill") {
        if (this.folders) {
            this.folders.forEach(folder => {
                if (folder.querySelector("span.folderIcon")) {
                    folder
                        .querySelector("span.folderIcon")
                        .querySelector("i.bi").className = ""

                    folder
                        .querySelector("span.folderIcon")
                        .querySelector("i").classList.add("bi", iconClassName)

                } else if (!folder.querySelector("span.folderIcon")) {
                    folder.insertAdjacentElement("afterbegin", this.createFolderIcon(iconClassName))
                }
            })
        }
    }

    setFileIcons(iconClassName = "bi-file-fill") {
        if (this.files) {
            this.files.forEach(file => {
                if (file.querySelector("span.fileIcon")) {
                    file
                        .querySelector("span.fileIcon")
                        .querySelector("i.bi").className = ""

                    file
                        .querySelector("span.fileIcon")
                        .querySelector("i").classList.add("bi", iconClassName)

                } else if (!file.querySelector("span.fileIcon")) {
                    file.insertAdjacentElement("afterbegin", this.createFileIcon(iconClassName))
                }
                // file.insertAdjacentElement("afterbegin", this.createFileIcon(iconClassName))
            })
        }
    }

    setRootFolder(rootFolderName = this.rootFolderName || "root folder") {
        if (!this.elm.querySelector("div.toolbar > div.rootFolderName")) {
            this.elm.querySelector("div.toolbar").insertAdjacentElement("afterbegin", this.createRootFolderElm(rootFolderName));
        } else if (this.elm.querySelector("div.toolbar > div.rootFolderName")) {
            this.elm.querySelector("div.toolbar > div.rootFolderName > span.label").innerText = rootFolderName;
        }
    }

    setToolbarElement() {
        let toolbar = document.createElement("div");
        toolbar.classList.add("toolbar");

        toolbar.insertAdjacentElement("afterbegin", this.createFolderControlIcons(["bi-file-plus", "bi-folder-plus", "bi-arrow-clockwise"]))
        this.elm.insertAdjacentElement("afterbegin", toolbar);
        
        this.setRootFolder(this.rootFolderName)
    }

    createRootFolderElm(rootFolderName = this.rootFolderName || "root folder") {
        let rootFolder = document.createElement("div");
        rootFolder.classList.add("rootFolderName");

        let spanLabel = document.createElement("span");
        spanLabel.classList.add("label");
        spanLabel.innerText = rootFolderName;

        rootFolder.appendChild(spanLabel);
        return rootFolder;
    }

    createFolderControlIcons(classNames) {
        
        let folderControlsElm = document.createElement("div");
            folderControlsElm.classList.add("folderControls");
        
            for(let i = 0; i < classNames.length; i++) {
                let currentClassName = classNames[i];
                let folderBtnElm = document.createElement("div");
                    folderBtnElm.classList.add("folderBtn");
                
                let spanElm = document.createElement("span");
                    spanElm.classList.add("folderIcon");

                let iElm = document.createElement("i");
                    iElm.classList.add("bi", currentClassName);
                
                spanElm.appendChild(iElm);
                folderBtnElm.appendChild(spanElm);

                folderControlsElm.appendChild(folderBtnElm);
            }

        return folderControlsElm;
    }

    createCaret() {
        let caret = document.createElement("span");
        let caret_I_element = document.createElement("i");

        caret.classList.add("caret");
        caret_I_element.classList.add("bi", "bi-caret-right-fill");

        caret.appendChild(caret_I_element);
        return caret;
    }

    createFolderIcon(className) {
        let spanContainer = document.createElement("span");
        let icon = document.createElement("i");

        spanContainer.classList.add("folderIcon");
        icon.classList.add("bi", className);

        spanContainer.appendChild(icon);

        return spanContainer;
    }

    createFileIcon(className) {
        let spanContainer = document.createElement("span");
        let icon = document.createElement("i");

        spanContainer.classList.add("fileIcon");
        icon.classList.add("bi", className);

        spanContainer.appendChild(icon);

        return spanContainer;
    }

    retrieveCaretAndIconBoundings(margin) {

        let folder = this.firstContainer.querySelector("div.folder");
        let caret = folder.querySelector("span.caret");
        let folderIcon = folder.querySelector("span.folderIcon");

        this.caretWidth = parseInt(getComputedStyle(caret).getPropertyValue("font-size"));
        this.folderIconWidth = parseInt(getComputedStyle(folderIcon).getPropertyValue("font-size"));

        this.extraMargin = margin;
        this.totalPadding = this.caretWidth + this.folderIconWidth + this.extraMargin;
        this.gap = this.extraMargin / 3;

        this.caretOffset = this.gap;
        this.iconOffset = (2 * this.gap) + this.caretWidth
    }

    setComputedStyles() {
        // console.log("computed")
        this.styleText = `
            div.tree-view-container > div.toolbar{
                padding-left: ${this.caretOffset + 3}px;
                padding-right: ${this.caretOffset + 3}px;
            }

            div.tree-view-container > div.tree div.view-element {
                padding-left: ${this.totalPadding}px;
                padding-right: ${this.totalPadding}px;
            }

            div.tree-view-container > div.tree div.view-element.folder span.caret {
                --left: ${this.caretOffset}px;
            }

            div.tree-view-container > div.tree div.view-element.folder span.folderIcon {
                --left: ${this.iconOffset}px;
            }
            
            div.tree-view-container > div.tree div.view-element.file span.fileIcon {
                --left: ${this.iconOffset}px;
            }
        `;

        if (!document.head.querySelector("style#computedTreeFolderStyles")) {
            let styleElm = document.createElement("style");
            styleElm.id = "computedTreeFolderStyles";

            styleElm.innerText = this.styleText;

            document.head.insertAdjacentElement("beforeend", styleElm)
        } else if (document.head.querySelector("style#computedTreeFolderStyles")) {
            document.head.querySelector("style#computedTreeFolderStyles").innerText = this.styleText;
        }

        this.subviews.forEach(subview => {
            let parentPadding = parseInt(getComputedStyle(subview.previousElementSibling).getPropertyValue("padding-left"));
            let viewElements = subview.querySelectorAll("div.view-element");

            viewElements.forEach(viewElement => {
                let padding = parentPadding + this.gap + (this.caretWidth / 2);
                viewElement.style.paddingLeft = `${padding}px`;

                if (viewElement.classList.contains("folder")) {
                    let caret = viewElement.querySelector("span.caret");
                    let folderIcon = viewElement.querySelector("span.folderIcon");

                    caret.style = `--left: calc(${padding}px - ${2 * this.folderIconWidth}px - ${2 * this.gap}px)`;
                    folderIcon.style = `--left: calc(${padding}px - ${this.folderIconWidth}px - ${this.gap}px)`;
                }

                if (viewElement.classList.contains("file")) {
                    let fileIcon = viewElement.querySelector("span.fileIcon");
                    fileIcon.style = `--left: calc(${padding}px - ${this.folderIconWidth}px - ${this.gap}px)`;
                }
            })
        })

    }

    removeEvents() { }

    toggleCaretActive(caret) {
        if (caret.classList.contains("caret")) {
            let caret_I_element = caret.querySelector("i.bi");
            if (!caret_I_element) return;

            if (caret_I_element.classList.contains("bi-caret-right-fill")) {
                caret_I_element.classList.remove("bi-caret-right-fill")
                caret_I_element.classList.add("bi-caret-down-fill")
            } else if (caret_I_element.classList.contains("bi-caret-down-fill")) {
                caret_I_element.classList.remove("bi-caret-down-fill")
                caret_I_element.classList.add("bi-caret-right-fill")
            }
        }
    }

    toggleCaretRemoveActive(caret) {
        if (caret.classList.contains("caret")) {
            let caret_I_element = caret.querySelector("i.bi");
            if (!caret_I_element) return;

            if (caret_I_element.classList.contains("bi-caret-down-fill")) {
                caret_I_element.classList.remove("bi-caret-down-fill")
                caret_I_element.classList.add("bi-caret-right-fill")
            }
        }
    }

    toggleCaret(caret) {
        if (caret.classList.contains("caret")) {
            let caret_I_element = caret.querySelector("i.bi");
            if (!caret_I_element) return;

            if (caret_I_element.classList.contains("bi-caret-right-fill")) {
                this.toggleCaretActive(caret)
            } else if (caret_I_element.classList.contains("bi-caret-down-fill")) {
                this.toggleCaretRemoveActive(caret)
            }
        }
    }

    addEvents() {
        try {    
            this.addFocusability();
        
            this.folders.forEach(folder => {
                folder.removeEventListener("click", this.removeEvents());
                folder.addEventListener("click", () => {
                    folder.parentElement.classList.toggle("active");
                    if (folder.nextElementSibling.classList.contains("subview")) {
                        folder.nextElementSibling.classList.toggle("active")
                    }

                    if (folder.querySelector("span.caret")) {
                        this.toggleCaret(folder.querySelector("span.caret"));
                    }
                });
            })

            this.viewElements.forEach(viewElement => {
                viewElement.addEventListener("focus", () => {
                    this.focusElm = viewElement;
                    // console.log(this.focusElm)
                });
                viewElement.addEventListener("blur", () => {
                    this.focusElm = undefined;
                    // console.log(this.focusElm)
                })
            })
        } catch { console.warn("Failed to add events.") }
    }

    addFocusability() {
        this.viewElements.forEach(viewElement => {
            viewElement.setAttribute("tabindex", -1);
        })
    }

    addIndicator() {
        let firstFolder = this.firstContainer.querySelector("div.folder");
        let height = Math.round(firstFolder.getBoundingClientRect().height);
        let carets = this.elm.querySelectorAll("div.tree span.caret");

        carets.forEach(caret => {
            caret.parentElement.parentElement.style = `
                --top: ${height}px;
                --left: calc(${getComputedStyle(caret).getPropertyValue("left")} + 2px);
            `
            // console.log(caret.parentElement.parentElement)
        })
        
    }

    refresh(margin = 12, folderIcon = "bi-folder-fill", fileIcon = "bi-file-fill") {
        this.define();
        this.setFolderIcons(folderIcon);
        this.setCarets();
        this.setFileIcons(fileIcon);
        this.retrieveCaretAndIconBoundings(margin);
        this.setComputedStyles();
        this.addIndicator()
    }

    set margin(newVal) {
        this.extraMargin = newVal;
        this.retrieveCaretAndIconBoundings(newVal);
        this.setComputedStyles();
    }
}

const tree = new TreeViewFolder(document.querySelector("div.tree-view-container"), "Test Folder");