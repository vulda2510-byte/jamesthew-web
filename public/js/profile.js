document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`panel-${targetTab}`)?.classList.add('active');
        });
    });

    const subButtons = document.querySelectorAll('.sub-tab-btn');
    const subPanels = document.querySelectorAll('.sub-panel');

    subButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSub = btn.getAttribute('data-sub');
            subButtons.forEach(b => b.classList.remove('active'));
            subPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`sub-${targetSub}`)?.classList.add('active');
        });
    });

    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(updateProfileForm);
            const payload = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                cookingStyle: formData.get('cookingStyle'),
                location: formData.get('location'),
                bio: formData.get('bio')
            };

            const submitBtn = updateProfileForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            try {
                submitBtn.innerText = 'Saving...';
                submitBtn.disabled = true;

                const response = await fetch('/api/v1/users/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                // #region agent log
                fetch('http://127.0.0.1:7886/ingest/c2c9f90b-7072-482f-8d89-0e9df247861d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e7d9b4'},body:JSON.stringify({sessionId:'e7d9b4',location:'profile.js:updateProfile',message:'Profile update response',data:{ok:response.ok,success:result.success,status:response.status},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
                // #endregion

                if (response.ok && result.success) {
                    alert('Profile updated successfully.');
                    window.location.href = '/profile';
                } else {
                    alert(result.message || 'Update failed. Please try again.');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Connection error. Please try again.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(changePasswordForm);
            const newPassword = formData.get('newPassword');
            const confirmNewPassword = newPassword;

            const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            try {
                submitBtn.innerText = 'Updating...';
                submitBtn.disabled = true;

                const response = await fetch('/api/v1/users/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        currentPassword: formData.get('currentPassword'),
                        newPassword,
                        confirmNewPassword
                    })
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Password updated successfully.');
                    changePasswordForm.reset();
                } else {
                    alert(result.message || 'Password update failed.');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                alert('Connection error. Please try again.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
