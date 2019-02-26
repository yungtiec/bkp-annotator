/*package annotator.ui.tags */
"use strict";

var util = require("../util");

var $ = util.$;
var _t = util.gettext;

// Take an array of tags and turn it into a string suitable for display in the
// viewer.
function stringifyTags(array) {
    return array.join(" ");
}

// Take a string from the tags input as an argument, and return an array of
// tags.
function parseTags(string) {
    string = $.trim(string);
    var tags = [];
    tags = string.split(";");

    return tags;
}

/**
 * function:: viewerExtension(viewer)
 *
 * An extension for the :class:`~annotator.ui.viewer.Viewer` that displays any
 * tags stored as an array of strings in the annotation's ``tags`` property.
 *
 * **Usage**::
 *
 *     app.include(annotator.ui.main, {
 *         viewerExtensions: [annotator.ui.tags.viewerExtension]
 *     })
 */
exports.viewerExtension = function viewerExtension(v) {
    function updateViewer(field, annotation) {
        field = $(field);
        if (
            annotation.tags &&
            $.isArray(annotation.tags) &&
            annotation.tags.length
        ) {
            field.addClass("annotator-tags").html(function() {
                return $.map(annotation.tags, function(tag) {
                    return (
                        '<span class="annotator-tag">' +
                        util.escapeHtml(tag) +
                        "</span>"
                    );
                }).join(" ");
            });
        } else {
            field.remove();
        }
    }

    v.addField({
        load: updateViewer
    });
};

/**
 * function:: editorExtension(editor)
 *
 * An extension for the :class:`~annotator.ui.editor.Editor` that allows
 * editing a set of space-delimited tags, retrieved from and saved to the
 * annotation's ``tags`` property.
 *
 * **Usage**::
 *
 *     app.include(annotator.ui.main, {
 *         viewerExtensions: [annotator.ui.tags.viewerExtension]
 *     })
 */
exports.editorExtension = function editorExtension(options, editor) {
    // The input element added to the Annotator.Editor wrapped in jQuery.
    // Cached to save having to recreate it everytime the editor is displayed.
    var field = null;
    var input = null;

    function updateField(field, annotation) {
        input.val("");
        $(".tagsinput .tag").remove();
        $(".ui-autocomplete-input").val("");
        $(".ui-autocomplete-input").attr(
            "placeholder",
            "Enter tag and press return"
        );
    }

    function setAnnotationTags(field, annotation) {
        annotation.tags = parseTags(input.val());
        input.val("");
        $(".tagsinput .tag").remove();
        $(".ui-autocomplete-input").val("");
        $(".ui-autocomplete-input").attr(
            "placeholder",
            "Enter tag and press return"
        );
    }

    field = editor.addField(
        Object.assign(
            {
                label: _t("Add some tags here (separate by space)") + "\u2026",
                load: updateField,
                submit: setAnnotationTags
            },
            options
        )
    );

    input = $(field).find(":input");
};
