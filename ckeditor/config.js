/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
	config.allowedContent = true;
	config.extraAllowedContent = 'span(*),a(*),div(*)';
	config.autoUpdateElement = false;
	config.fillEmptyBlocks = false;
	config.autoParagraph = false;
	config.auto_inline = false;
	config.protectedSource.push(/\{foreach[\s\S]*?}|\{\/foreach}/g);
	config.templates_replaceContent = false;
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
};

CKEDITOR.on('instanceReady', function (ev) {
	var blockTags = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'li', 'blockquote', 'ul', 'ol',
		'table', 'thead', 'tbody', 'tfoot', 'td', 'th'];
	ev.editor.isReadOnly = true;
	for (var i = 0; i < blockTags.length; i++) {
		ev.editor.dataProcessor.writer.setRules(blockTags[i], {
			indent: false,
			breakBeforeOpen: true,
			breakAfterOpen: false,
			breakBeforeClose: false,
			breakAfterClose: true
		});
	}
});

CKEDITOR.dtd.$removeEmpty.span = 0;
