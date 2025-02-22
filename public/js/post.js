//resize height textarea
const textarea = document.getElementById('post-text');
textarea && textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

//=== comment
const comment = document.getElementById('comment');
comment && comment.addEventListener('input', function () {
    if (this.scrollHeight < 135) {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    }
});
//=====
const posts = document.querySelectorAll('.post');

posts.forEach(post => {
    let menuComment = post.firstElementChild;
    let pressTimer;

    post.addEventListener('mousedown', function () {
        post.classList.add('bg-gray-200');
        pressTimer = setTimeout(function () {
            menuComment.classList.remove('hidden');
        }, 1000);
    });

    post.addEventListener('touchstart', function () {
        post.classList.add('bg-gray-200');
        pressTimer = setTimeout(function () {
            menuComment.classList.remove('hidden');
        }, 1000);
    });

    post.addEventListener('mouseup', clearTimer);
    post.addEventListener('mouseleave', clearTimer);
    post.addEventListener('touchend', clearTimer);
    post.addEventListener('touchcancel', clearTimer);

    function clearTimer() {
        clearTimeout(pressTimer);
    }
});

document.addEventListener('click', function (event) {
    posts.forEach(post => {
        post.classList.remove('bg-gray-200');
        let menuComment = post.firstElementChild;
        if (!post.contains(event.target)) {
            menuComment.classList.add('hidden');
        }
    });
});

document.addEventListener('touchstart', function (event) {
    posts.forEach(post => {
        post.classList.remove('bg-gray-200');
        let menuComment = post.firstElementChild;
        if (!post.contains(event.target)) {
            menuComment.classList.add('hidden');
        }
    });
});
//edit comment
function editComment(ele, commentId, comment) {
    ele.parentNode.classList.add('hidden');
    //==========
    console.log(decodeURIComponent(commentId))
    //=
    textAreaComment = document.getElementById('comment');
    textAreaComment.value = comment;
    //=
    textAreaComment.previousElementSibling.name = "commentId";
    textAreaComment.previousElementSibling.value = decodeURIComponent(commentId);
    //=
    textAreaComment.parentNode.action = "/post/editComment";
}
//=addLike
async function addLike(ele, postId) {
    const likePost = ele.parentNode.parentNode.previousElementSibling.querySelector('.likePost');
    axios.get('/post/like/' + decodeURIComponent(postId)).then(response => {
        if (response.status === 200 && response.data.message == "yes") {
            if (response.data.countLikes > 1)
                likePost.innerHTML = response.data.countLikes + ' انت واخرون';
            else
                likePost.innerHTML = response.data.countLikes + 'انت';

            ele.firstElementChild.setAttribute('fill', '#000000');
        }
        else if (response.status === 200 && response.data.message == 'no') {
            if (response.data.countLikes > 1)
                likePost.innerHTML = response.data.countLikes + response.data.lastLikeUser + ' واخرون';
            else
                likePost.innerHTML = response.data.countLikes + ' ' + response.data.lastLikeUser;
            ele.firstElementChild.setAttribute('fill', 'none');
        }
        else {
            document.body.innerHTML = response.data;
        }
    }).catch(err => { });
}
//report
let reportMenu = document.querySelectorAll('.report-menu');
reportMenu.forEach(rMenu => {
    rMenu.addEventListener('click', function () {
        if (this.nextElementSibling.classList.contains('hidden'))
            this.nextElementSibling.classList.remove('hidden');
        setTimeout(() => {
            this.nextElementSibling.style = '1';
        },100)
    });
});
let reportCheck = document.querySelectorAll('form.report label');
reportCheck.forEach(report => {
    let x = 0;
    report.addEventListener('click', function () {
        if (x > 0)
        {
            x = 0;
            return;
        }
        x++;
        if (this.style.backgroundColor == 'orange')
            this.style.backgroundColor = 'black';
        else
            this.style.backgroundColor = 'orange';
    })
});
let reportClose = document.querySelectorAll('.report-close');
reportClose.forEach(rClose => {
    rClose.addEventListener('click', function () {
        this.parentNode.parentNode.classList.add('hidden');
    });
});
//=================
//filepond
FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit,
    FilePondPluginFileValidateSize,
    FilePondPluginVideoPreview
);
function addAudio() {
    return `<div class="Audio">
     <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001"
                    stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                <path d="M15 5.5H18.5M18.5 5.5H22M18.5 5.5V9M18.5 5.5V2" stroke="#1C274C" stroke-width="1.5"
                    stroke-linecap="round" />
                <path
                    d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 10.8717 2 9.87835 2.02008 9M12 2C7.28595 2 4.92893 2 3.46447 3.46447C3.03965 3.88929 2.73806 4.38921 2.52396 5"
                    stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            </div>`;
}
let filu = document.querySelector('input[type="file"]');
FilePond.create(filu, {
    allowMultiple: true,
    allowMediaPreview: true,
    acceptedFileTypes: ['image/*', 'video/*'],
    labelIdle: addAudio(),
    allowFileSizeValidation: true,
    allowImagePreview: true,
    allowImageCrop: true,
    allowImageResize: true,
    allowImageTransform: true,
    allowImageEdit: true,
    stylePanelAspectRatio: 0,
    instantUpload: false,
});
//====remove logo library
document.querySelector('.filepond--credits').remove();
//===============
function componentUpload() {
    return `<div class="h-screen flex flex-wrap justify-center items-center">
    <div>
        <div class="w-20 h-20 border-8 rounded-full border-orange-500 border-r-transparent aniRot">
        
        </div>
        <p class="text-center">إنتظر لحظة...</p>
    </div>
     <div id="progress-container" style="width: 100%; background: #f3f3f3;">
        <div id="progress-bar" style="width: 0%; height: 20px; background: #4caf50;"></div>
    </div>
</div>`;
}
function componentSuccess() {
    return `<div class="h-screen flex flex-wrap justify-center items-center">
    <div>
        <svg width="80px" height="80px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>success</title>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="add-copy" fill="#006400" transform="translate(42.666667, 42.666667)">
                    <path
                        d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.43872,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.438933,384 213.333333,384 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z"
                        id="Shape">

                    </path>
                </g>
            </g>
        </svg>
        <p class="text-center">تم بنجاح</p>
    </div>
</div>`;
}
try {
    document.getElementById('upload').addEventListener('click', async function (e) {
        e.preventDefault();
        //=========================
        const pond = FilePond.find(document.querySelector('.filepond'));
        const files = pond.getFiles();
        let totalFiles = files.length;
        let uploadedFiles = 0;
        const post_text = document.querySelector('textarea[name="post-text"]').value;

        let postId = 'none';
        document.body.innerHTML = componentUpload();
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('content', post_text);
            formData.append('postId', postId);
            if (uploadedFiles === 0) {
                let countF = totalFiles + "";
                formData.append('countF', countF);
            }
            const response = await fetch('/post/create', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                data = await response.json();
                postId = data.postId;
                uploadedFiles++;
                const progressPercentage = (uploadedFiles / totalFiles) * 100;
                document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
            }
            else {

            }
        }
        document.body.innerHTML = componentSuccess();
        setTimeout(() => {
            window.location.pathname = '/';
        }, 300);

    });
} catch (error) {

}
//===================================
let filesDel = [];
function delAudio(ele, nameFile) {
    ele.parentNode.remove();
    nameFile = decodeURIComponent(nameFile);
    filesDel.push(nameFile);
    console.log(filesDel);
}
//===============
document.getElementById('update').addEventListener('click', async function (e) {
    e.preventDefault();
    //=========================
    const pond = FilePond.find(document.querySelector('.filepond'));
    const files = pond.getFiles();
    let totalFiles = files.length;
    let uploadedFiles = 0;
    const post_text = document.querySelector('textarea[name="post-text"]').value;

    let postId = document.getElementById('postId').value;
    document.body.innerHTML = componentUpload();
    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file.file);
        formData.append('content', post_text);
        formData.append('postId', postId);
        if (uploadedFiles === 0) {
            let countF = (totalFiles - filesDel.length) + "";
            formData.append('countF', countF);
            formData.append('fileDel', JSON.stringify(filesDel));
        }
        const response = await fetch('/post/update', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            data = await response.json();
            console.log(data);
            uploadedFiles++;
            const progressPercentage = (uploadedFiles / totalFiles) * 100;
            document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
        }
        else {

        }
    }
    document.body.innerHTML = componentSuccess();
    setTimeout(() => {
        window.location.pathname = '/post/mePosts';
    }, 300);

});

function menuPost(event) {
    event.querySelector('#men-open').classList.toggle('hidden');
    event.querySelector('#men-close').classList.toggle('hidden')
    const mPost = event.nextElementSibling;
    mPost.classList.toggle('hidden');
}