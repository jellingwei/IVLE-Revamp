$(document).ready(function () {
    $(".pre-items").slimscroll({
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

// pre-items

function loadWorkbinList() {
    var todayDate = new Date();
    var todayHeader = '<h3 class="pre-item-dates">Today</h3>';
    var yesterdayHeader = '<h3 class="pre-item-dates">Yesterday</h3>';
    var dateHeader = '<h3 class="pre-item-dates"></h3>';

    var workbinContainer = $(".pre-items");
    workbinContainer.html("");
    sortWorkbinContentByDate();
    for (var i = 0; i < workbinContent.length; i++) {
        var content = workbinContent[i];
        
        workbinContainer.append(getDateHeaderHtml(content.time));

        var html = '<div class="workbinContent pre-items-wrapper ' + content.folder + ' ' + content.moduleCode +' " data-announcement-id="' + i + '" onclick="showPreview(\'' + content.fileurl + '\')"><div class="pre-item-head">' +
            '<span class="pre-items-name">' + content.moduleCode + '</span>' +
            '<span class="">&nbsp;&nbsp;&nbsp;&nbsp;' + content.folder + '</span>' +
            '<div class="right"><span class="pre-itemstime">' + getNiceTimeString(content.time) + '</span>' +
            '</div></div>' +
            '<div class="pre-item-body"> <span>' +
            '<input class="checkbox1" type="checkbox" name="' + content.title + '" value="Download"></span> ' +
            '<span class="pre-item-h4">' + content.title + '</span>' +
            '</a>';
        if (content.content) {
            html += '<p class="pre-item-p truncate">' + stripHtmlTags(content.content) + '</p></div></div>';
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
        return '<h3 class="pre-item-dates">' + value + '</h3>';
    }
}



// load announcements
// function loadAnnouncementsHandler() {
//     $(".pre-items-wrapper").click(function () {
//         $(".pre-items-wrapper").removeClass('active');
//         $(this).addClass('active');

//         var index = $(this).data('announcement-id');

//         $(".item-title-header").html("");
//         $(".item-title-header").append("<b>" + announcements[index].moduleCode + ":</b> " + announcements[index].title);
//         $(".item-inside-content").html("");
//         $(".item-inside-content").append(announcements[index].content);

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
    $(".item-content").show();
    $(".upload-container").hide();

    $(".category-modules ul li").click(function () {
        $(".category-modules ul li").removeClass("active");
        $(this).addClass("active");
        
        var modCode = $(this).data("module");
        
        if (modCode === viewingModule) {
            viewingModule = null;
        } else{
            viewingModule = modCode;
        }

        $(".item-content").show();
        $(".upload-container").hide();

        viewingFolder = null;  // reset folder filter
        
        showAllDates();
        hideWorkbinItems();
        hideFolders();
        hideDatesWithoutContent();
    });
    
    $(".category-folders ul li").click(function () {
        $(".category-folders ul li").removeClass("active");
        $(this).addClass("active");
         var folder = $(this).data("folder");
         
        if (folder === viewingFolder) {
            viewingFolder = null;
        } else {
            viewingFolder = folder;       
        }

        if (folder === "Submission") {
             $(".item-content").hide();
            $(".item-options").hide();
            $(".upload-container").show();
        } else {
            $(".item-content").show();
            $(".item-options").show();
            $(".upload-container").hide();
        }

        showAllDates();
        hideWorkbinItems();
        hideDatesWithoutContent();
    });    
    
     $("#selectall").click(function () {
         if(this.checked) {
             $('.checkbox1').each(function() {
                 this.checked = true;
             });
         } else {
            $('.checkbox1').each(function() {
                this.checked = false;
            });
                
         }
             
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
    $(".pre-item-dates").show();


}

function hideDatesWithoutContent() {
    $(".pre-item-dates").each(function(index, value) {
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
                                    dictDefaultMessage: "Click / Drag and drop files here for submission",
                                    dictResponseError: "Upload succeeded" }); // give success message for failure, since prototype
