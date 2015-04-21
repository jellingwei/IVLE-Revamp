$(document).ready(function () {
    $(".pre-emails").slimscroll({
        height: 'auto'
    });

    loadWorkbinList();
    // loadAnnouncementsHandler();
    setClickHandlersOnSidebarItems();
    hideFolders();
});

// menu
$(".close-menu").click(function () {
    // var toggleWidth = $(".menu").width() == 50 ? "15%" : "50px";
    // $(".menu").animate({ width: toggleWidth });

    if ($(".menu").width() == 50) {
        $(".menu").animate({width: "15%"});
        $(".min-max .row").css("padding", "0 20px");
        $(".category-header").css("display", "block");
        $(".categories a").css("display", "inline");
    } else {
        $(".menu").animate({width: "50px"});
        $(".min-max .row").css("padding", "0 15px");
        $(".category-header").css("display", "none");
        $(".categories a").css("display", "none");
    }

});

// pre-emails

function loadWorkbinList() {
    var todayDate = new Date();
    var todayHeader = '<h3 class="pre-email-dates">Today</h3>';
    var yesterdayHeader = '<h3 class="pre-email-dates">Yesterday</h3>';
    var dateHeader = '<h3 class="pre-email-dates"></h3>';

    var workbinContainer = $(".pre-emails");
    workbinContainer.html("");
    sortWorkbinContentByDate();
    for (var i = 0; i < workbinContent.length; i++) {
        var content = workbinContent[i];
        
        workbinContainer.append(getDateHeaderHtml(content.time));

        var html = '<div class="workbinContent pre-emails-wrapper ' + content.folder + ' ' + content.moduleCode +' " data-announcement-id="' + i + '" onclick="showPreview(\'' + content.fileurl + '\')"><div class="pre-email-head">' +
            '<span class="pre-emails-name">' + content.moduleCode + '</span>' +
            '<span class="">&nbsp;&nbsp;&nbsp;&nbsp;' + content.folder + '</span>' +
            '<div class="right"><span class="pre-emailstime">' + getNiceTimeString(content.time) + '</span>' +
            '</div></div>' +
            '<div class="pre-email-body"> <span>' +
            '<input type="checkbox" name="' + content.title + '" value="Download"></span> ' +
            '<span class="pre-email-h4">' + content.title + '</span>' +
            '</a>';
        if (content.content) {
            html += '<p class="pre-email-p truncate">' + stripHtmlTags(content.content) + '</p></div></div>';
        }
        workbinContainer.append(html);
    }
}

function stripHtmlTags(string) {
    // CREDIT: https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/
    return string.replace(/(<([^>]+)>)/ig, "");
}

var displayedHeaders = {};

function getDateHeaderHtml(date) {
    var todayDate = new Date();
    var yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    var value = "";
    if (date.toDateString() === todayDate.toDateString() && !displayedHeaders[date.toDateString()]) {
        displayedHeaders[date.toDateString()] = true;
        value = "Today";
    } else if (date.toDateString() === yesterdayDate.toDateString() && !displayedHeaders[date.toDateString()]) {
        displayedHeaders[date.toDateString()] = true;
        value = "Yesterday";
    } else if (!displayedHeaders[date.toDateString()]){
        displayedHeaders[date.toDateString()] = true;
        value = date.toDateString();
    }
    if (value != "") {
        return '<h3 class="pre-email-dates">' + value + '</h3>';
    }
}



// load announcements
// function loadAnnouncementsHandler() {
//     $(".pre-emails-wrapper").click(function () {
//         $(".pre-emails-wrapper").removeClass('active');
//         $(this).addClass('active');

//         var index = $(this).data('announcement-id');

//         $(".email-title-header").html("");
//         $(".email-title-header").append("<b>" + announcements[index].moduleCode + ":</b> " + announcements[index].title);
//         $(".email-inside-content").html("");
//         $(".email-inside-content").append(announcements[index].content);

//     });
// }

// format time nicely
function getNiceTimeString(date){
    var value;
    value = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    value += ':';
    value += date.getMinutes();
    value += ' ';
    value += date.getHours() >= 12 ? 'PM' : 'AM';
    return value;
}

// view-modules content

var viewingModule;
var viewingFolder;

function setClickHandlersOnSidebarItems() {
    $(".email-content").show();
    $(".upload-container").hide();

    $(".category-modules ul li").click(function () {
        
        var modCode = $(this).data("module");
        
        if (modCode === viewingModule) {
            viewingModule = null;
        } else{
            viewingModule = modCode;
        }

        $(".email-content").show();
        $(".upload-container").hide();

        viewingFolder = null;  // reset folder filter
        
        showAllDates();
        hideWorkbinItems();
        hideFolders();
        hideDatesWithoutContent();
    });
    
    $(".category-folders ul li").click(function () {
         var folder = $(this).data("folder");
         
        if (folder === viewingFolder) {
            viewingFolder = null;
        } else {
            viewingFolder = folder;       
        }

        if (folder === "Submission") {
            $(".email-content").hide();
            $(".upload-container").show();
        } else {
            $(".email-content").show();
            $(".upload-container").hide();
        }

        showAllDates();
        hideWorkbinItems();
        hideDatesWithoutContent();
    });    
    
     $(".download").click(function () {
         
      }); 
}

function hideWorkbinItems() {
    var contentToShow = 
       $(".workbinContent").filter(function(val) {
            if (viewingModule && viewingFolder) {
                return ($(this).hasClass(viewingFolder) && $(this).hasClass(viewingModule));
            } else if (viewingModule) {
                return ($(this).hasClass(viewingModule));
            } else if (viewingFolder) {
                return ($(this).hasClass(viewingFolder));
            } else {
                return true;   
            }

        });
    contentToShow.show();
        
    var contentToHide = 
      $(".workbinContent").filter(function(val) {
            if (viewingModule && viewingFolder) {
                return ($(this).hasClass(viewingFolder) !== true || $(this).hasClass(viewingModule) !== true);
            } else if (viewingModule) {
                return ($(this).hasClass(viewingModule) !== true);
            } else if (viewingFolder) {
                return ($(this).hasClass(viewingFolder) !== true);  
            } else {
                return false;
            }

        });
    contentToHide.hide();   

    
}

function obtainWorkbinContentForModule(modCode) {
    if (modCode) {
        var moduleContent = workbinContent.filter(function(workbinItem) {
            return (workbinItem.moduleCode === modCode);
        });
        return moduleContent;
    } else {
        return workbinContent;
    }
}

function obtainFoldersForModule(modCode) {
    var folders = obtainWorkbinContentForModule(modCode).map(function(workbinItem) {
        return workbinItem.folder;    
    });
    
    
    // remove duplicates
    folders = folders.filter(function (v, i, a) { 
        return a.indexOf(v) == i 
    });
    
    return folders;
}


function hideFolders() {
    var folderNamesToShow = obtainFoldersForModule(viewingModule);
    
    var allFolders = obtainFoldersForModule();
    var folderNamesToHide = allFolders.filter(function(folder) {
        return folderNamesToShow.indexOf(folder) === -1;   
    });
    
    var foldersToShow = $(".category-folders ul li").filter(function(folder) {
        return folderNamesToShow.indexOf($(this).data("folder")) !== -1; 
    });
    var foldersToHide = $(".category-folders ul li").filter(function(folder) {
        return folderNamesToHide.indexOf($(this).data("folder")) !== -1; 
    });
    
    foldersToShow.show();
    foldersToHide.hide();
}

function sortWorkbinContentByDate() {
    workbinContent.sort(function(item1, item2) {
        return new Date(item2.time) - new Date(item1.time);
    });

}

function showPreview(fileUrl) {
    PDFJS.getDocument(fileUrl).then(function(pdf) {
      $("#previewLoading").show();
      pdf.getPage(1).then(function(page) {
          $("#previewLoading").hide();
            var scale = 1.5;
            var viewport = page.getViewport(scale);

            var canvas = document.getElementById('previewPage1');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            page.render(renderContext);
      });

    });
}


function showAllDates() {
    $(".pre-email-dates").show();


}

function hideDatesWithoutContent() {
    $(".pre-email-dates").each(function(index, value) {
        var siblings = $(value).next();

        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            console.log(sibling);
            if (!$(sibling).is(":visible") || !$(sibling).hasClass("workbinContent")) {
                $(value).hide();
                break;
            }
        }

    });


}


$("#submissionsUpload").dropzone({ url: "/fake/path",
                                    dictDefaultMessage: "Drag and drop files here for submission",
                                    dictResponseError: "Upload succeeded" }); // give success message for failure, since prototype
