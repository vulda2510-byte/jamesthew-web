// public/js/profile.js - Recipes sub-tab switching + Profile AJAX forms
// NOTE: Dashboard / Recipes / Subscription / Settings are now separate routes
// (src/routes/profile.routes.js), so there is no top-level tab switcher here anymore -
// only the My Recipes / Saved Recipes sub-tabs inside the Recipes page.

document.addEventListener('DOMContentLoaded', () => {
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

    // --- Update profile form ---
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
                bio: formData.get('bio'),
                website: formData.get('website'),
                phone: formData.get('phone')
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

                if (response.ok && result.success) {
                    alert('Profile updated successfully.');
                    window.location.reload();
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

    // --- Change email form ---
    const updateEmailForm = document.getElementById('updateEmailForm');
    if (updateEmailForm) {
        updateEmailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(updateEmailForm);
            const submitBtn = updateEmailForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            try {
                submitBtn.innerText = 'Saving...';
                submitBtn.disabled = true;

                const response = await fetch('/api/v1/users/email', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ email: formData.get('email') })
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    alert('Email updated successfully.');
                    window.location.reload();
                } else {
                    alert(result.message || 'Update failed. Please try again.');
                }
            } catch (error) {
                console.error('Error updating email:', error);
                alert('Connection error. Please try again.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Change password form ---
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(changePasswordForm);
            const newPassword = formData.get('newPassword');
            const confirmNewPassword = formData.get('confirmNewPassword');

            if (newPassword !== confirmNewPassword) {
                alert('New password and confirmation do not match.');
                return;
            }

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

    // --- Avatar upload ---
    const avatarInput = document.getElementById('avatarInput');
    const avatarTrigger = document.getElementById('avatarEditBtn');
    const avatarFileName = document.getElementById('avatarFileName');

    if (avatarTrigger && avatarInput) {
        avatarTrigger.addEventListener('click', () => avatarInput.click());
    }
    if (avatarInput) {
        avatarInput.addEventListener('change', async () => {
            if (!avatarInput.files || !avatarInput.files[0]) return;

            const file = avatarInput.files[0];
            if (avatarFileName) {
                avatarFileName.textContent = `Uploading ${file.name}...`;
                avatarFileName.hidden = false;
            }

            const originalBtnHtml = avatarTrigger ? avatarTrigger.innerHTML : null;
            if (avatarTrigger) {
                avatarTrigger.disabled = true;
                avatarTrigger.textContent = 'Uploading...';
            }

            const formData = new FormData();
            formData.append('avatar', file);

            try {
                const response = await fetch('/api/v1/users/avatar', {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: formData
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    window.location.reload();
                } else {
                    alert(result.message || 'Avatar upload failed.');
                    if (avatarFileName) avatarFileName.hidden = true;
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                alert('Connection error. Please try again.');
                if (avatarFileName) avatarFileName.hidden = true;
            } finally {
                if (avatarTrigger) {
                    avatarTrigger.disabled = false;
                    if (originalBtnHtml !== null) avatarTrigger.innerHTML = originalBtnHtml;
                }
                avatarInput.value = '';
            }
        });
    }

    // --- Search users (Dashboard) ---
    const searchUserForm = document.getElementById('searchUserForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[ch]);
    }

    function renderSearchResults(users) {
        if (!users.length) {
            searchResults.innerHTML =
                '<div class="empty-state">' +
                '<i class="fa-regular fa-face-frown empty-state-icon"></i>' +
                '<p class="empty-state-title">No users found</p>' +
                '<p class="empty-state-text">Try a different name or username.</p>' +
                '</div>';
            return;
        }

        searchResults.innerHTML = users.map(u => {
            const displayName = u.fullName || u.username;
            const avatar = u.avatarUrl
                ? `<img src="${escapeHtml(u.avatarUrl)}" alt="" class="search-result-avatar">`
                : `<div class="search-result-avatar">${escapeHtml(displayName.charAt(0).toUpperCase())}</div>`;
            return `
                <div class="search-result-item">
                    <div class="search-result-identity">
                        ${avatar}
                        <div>
                            <div class="search-result-name">${escapeHtml(displayName)}</div>
                            <div class="search-result-handle">@${escapeHtml(u.username)}</div>
                        </div>
                    </div>
                    <span class="search-result-role">${escapeHtml(u.role)}</span>
                </div>
            `;
        }).join('');
    }

    if (searchUserForm && searchInput && searchResults) {
        searchUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length < 2) {
                alert('Please enter at least 2 characters.');
                return;
            }

            const submitBtn = searchUserForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            try {
                submitBtn.innerText = 'Searching...';
                submitBtn.disabled = true;

                const response = await fetch(`/api/v1/users/search?q=${encodeURIComponent(query)}`, {
                    credentials: 'same-origin'
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    renderSearchResults(result.data || []);
                } else {
                    alert(result.message || 'Search failed. Please try again.');
                }
            } catch (error) {
                console.error('Error searching users:', error);
                alert('Connection error. Please try again.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Unfollow chef ---
    document.querySelectorAll('.btn-unfollow').forEach(btn => {
        btn.addEventListener('click', async () => {
            const chefId = btn.getAttribute('data-chef-id');
            if (!chefId) return;

            btn.disabled = true;
            try {
                const response = await fetch(`/api/v1/users/following/${chefId}`, {
                    method: 'DELETE',
                    credentials: 'same-origin'
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    const list = btn.closest('.chefs-list');
                    btn.closest('.chef-card')?.remove();

                    if (list && list.querySelectorAll('.chef-card').length === 0) {
                        list.outerHTML =
                            '<div class="empty-state">' +
                            '<i class="fa-regular fa-user empty-state-icon"></i>' +
                            '<p class="empty-state-title">Not following anyone yet</p>' +
                            '<p class="empty-state-text">Use the search above to find chefs and follow their work.</p>' +
                            '</div>';
                    }
                } else {
                    alert(result.message || 'Could not unfollow.');
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Error unfollowing chef:', error);
                alert('Connection error. Please try again.');
                btn.disabled = false;
            }
        });
    });

    // --- Unsave recipe (from the Saved Recipes tab) ---
    document.querySelectorAll('.btn-unsave-recipe').forEach(btn => {
        btn.addEventListener('click', async () => {
            const recipeId = btn.getAttribute('data-recipe-id');
            if (!recipeId) return;

            btn.disabled = true;
            try {
                const response = await fetch(`/api/v1/recipes/${recipeId}/save`, {
                    method: 'DELETE',
                    credentials: 'same-origin'
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    const panel = btn.closest('.sub-panel');
                    btn.closest('.profile-recipe-card')?.remove();

                    // Đồng bộ lại số đếm trên nút sub-tab với số card còn lại
                    const remaining = panel ? panel.querySelectorAll('.profile-recipe-card').length : 0;
                    const countEl = document.querySelector('.sub-tab-btn[data-sub="saved-recipes"] .sub-tab-count');
                    if (countEl) countEl.textContent = remaining;

                    if (panel && remaining === 0) {
                        panel.innerHTML =
                            '<div class="empty-state">' +
                            '<i class="fa-regular fa-bookmark empty-state-icon"></i>' +
                            '<p class="empty-state-title">No saved recipes</p>' +
                            '<p class="empty-state-text">Tap “Save Recipe” on any recipe to keep it here.</p>' +
                            '<a href="/recipes" class="btn-gold-outline">Browse Recipes</a>' +
                            '</div>';
                    }
                } else {
                    alert(result.message || 'Could not remove from saved recipes.');
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Error unsaving recipe:', error);
                alert('Connection error. Please try again.');
                btn.disabled = false;
            }
        });
    });
});
