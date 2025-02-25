// Handle merke preview clicks
document.querySelectorAll('.merke-preview').forEach(preview => {
    preview.addEventListener('click', () => {
        const modal = document.getElementById('merkeModal');
        const modalImg = document.getElementById('merkeImage');
        modal.style.display = "block";
        modalImg.src = preview.getAttribute('data-src');
    });
});

// Close modal when clicking the x
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('merkeModal').style.display = "none";
});

// Close modal when clicking outside the image
window.addEventListener('click', (event) => {
    const modal = document.getElementById('merkeModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Handle edit and delete buttons
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const type = btn.getAttribute('data-type');
        // Redirect to edit page based on type
        if (type === 'flokk') {
            window.location.href = `/editFlokk?id=${id}`;
        } else if (type === 'reinsdyr') {
            window.location.href = `/editRein?id=${id}`;
        }
    });
});

document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const type = btn.getAttribute('data-type');
        
        if (confirm(`Er du sikker på at du vil slette denne ${type === 'flokk' ? 'flokken' : 'reinsdyret'}?`)) {
            try {
                const response = await fetch(`/${type}/${type === 'flokk' ? 'deleteFlokk' : 'deleteRein'}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        [type === 'flokk' ? 'flokkId' : 'reinsdyrId']: id
                    }),
                    credentials: 'include'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Slettet!');
                    location.reload();
                } else {
                    alert(result.message || 'Noe gikk galt');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Noe gikk galt ved sletting');
            }
        }
    });
});
