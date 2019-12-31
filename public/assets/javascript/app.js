const db = require("../../../models");

$(document).ready(function() {
	//this function posts a note to the server
	function sendNote(element) {
		let note = {};
		(note.articleId = $(element).attr("data-id")), (note.title = $("#noteTitleEntry").val().trim());
		note.body = $("#noteBodyEntry").val().trim();
		if (note.title && note.body) {
			$.ajax({
				url: "/notes/createNote",
				type: "POST",
				data: note,
				success: function(response) {
					showNote(response, note.articleId);
					$("#noteBodyEntry, #noteTitleEntry").val("");
				},
				error: function(error) {
					showErrorModal(error);
				}
			});
		}
	}

	//this function displays the error modal if there is an ajax error
	function showErrorModal(error) {
		$("#error").modal("show");
	}

	//this function displays the notes in the notemodal
	function showNote(element, articleId) {
		let $title = $("<p>").text(element.title).addClass("noteTitle");
		let $deleteButton = $("<button>").text("X").addClass("deleteNote");
		let $note = $("<div>")
			.append($deleteButton, $title)
			.attr("data-note-id", element._id)
			.attr("data-article-id", articleId)
			.addClass("note")
			.appendTo("#noteArea");
	}

	//this is an event listener that reloads the root when the user closes the modal showing the number of scraped articles
	$("#alertModal").on("hide.bs.modal", function(e) {
		window.location.href = "/";
	});

	//this is a click event to scrape for new articles
	$("#scrape").on("click", function(e) {
		e.preventDefault();
		$.ajax({
			url: "/scrape/newArticles",
			type: "GET",
			success: function(response) {
				$("#numArticles").text(response.count);
			},
			error: function(error) {
				showErrorModal(error);
			},
			complete: function(result) {
				$("#alertModal").modal("show");
			}
		});
	});

	//this is a click event to save an article
	$(document).on("click", ".saveArticle", function(e) {
		let articleId = $(this).data("id");
		console.log("articleId=", articleId);
		$.ajax({
			url: "/articles/save/" + articleId,
			type: "POST",
			success: function(response) {
				window.location.href = "/";
			},
			error: function(error) {
				showErrorModal(error);
			}
		});
	});

	//this is a click event to open my note modal and populate it with notes
	$(".addNote").on("click", function(e) {
		$("#noteArea").empty();
		$("#noteTitleEntry, #noteBodyEntry").val("");
		let id = $(this).data("id");
		$("#submitNote, #noteBodyEntry").attr("data-id", id);
		$.ajax({
			url: "/notes/getNotes/" + id,
			type: "GET",
			success: function(data) {
				$.each(data.notes, function(i, item) {
					showNote(item, id);
				});
				$("#noteModal").modal("show");
			},
			error: function(error) {
				showErrorModal(error);
			}
		});
	});

	//this is my click event to create a note
	$("#submitNote").on("click", function(e) {
		e.preventDefault();
		sendNote($(this));
	});

	//this is my keypress event that allows user to submit note with the enter key.
	$("#noteBodyEntry").on("keypress", function(e) {
		if (e.keyCode == 13) {
			sendNote($(this));
		}
	});

	//this is a click event to delete an article from savedArticles
	$(".deleteArticle").on("click", function(e) {
		e.preventDefault();
		let id = $(this).data("id");
		$.ajax({
			url: "/articles/deleteArticle/" + id,
			type: "DELETE",
			success: function(response) {
				window.location.href = "/articles/viewSaved";
			},
			error: function(error) {
				showErrorModal(error);
			}
		});
	});

	//this is a click event to delete a note from a saved article
	$(document).on("click", ".deleteNote", function(e) {
		e.stopPropagation();
		let thisItem = $(this);
		let ids = {
			noteId: $(this).parent().data("note-id"),
			articleId: $(this).parent().data("article-id")
		};

		$.ajax({
			url: "/notes/deleteNote",
			type: "POST",
			data: ids,
			success: function(response) {
				thisItem.parent().remove();
			},
			error: function(error) {
				showErrorModal(error);
			}
		});
	});

	//this is a click event to get the title and body of a single note and populate the note modal inputs with it
	$(document).on("click", ".note", function(e) {
		e.stopPropagation();
		let id = $(this).data("note-id");
		$.ajax({
			url: "/notes/getSingleNote/" + id,
			type: "GET",
			success: function(note) {
				$("#noteTitleEntry").val(note.title);
				$("#noteBodyEntry").val(note.body);
			},
			error: function(error) {
				console.log(error);
				showErrorModal(error);
			}
		});
	});
});
