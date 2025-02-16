document.getElementById('next').addEventListener('click', async (e) => {
    e.preventDefault();
    let avatar = document.querySelector('input[type="file"]');
    const files = avatar.files;

    if (files.length > 0) {
        document.getElementById('profile').classList.add('aniRot');
        const lastFile = files[files.length - 1];

        const formData = new FormData();
        formData.append('file', lastFile);

        try {
            const response = await fetch('/avatar', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                console.log('success');
                let url = location.href;
                surl = url.split('/');
                lW = surl[surl.length - 1];
                if (lW === "profile")
                {

                    location.pathname ="/";
                }
                else {  
                    location.pathname ='/descrip';
                }
            }
            else {
                console.log('error');
            }
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    } else {
        console.log('لا توجد ملفات لتحميلها.');
    }
});
