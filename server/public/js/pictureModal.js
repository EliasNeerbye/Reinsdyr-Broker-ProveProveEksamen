document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('merkeModal');
    const modalImg = document.getElementById('merkeImage');
    const closeBtn = document.querySelector('.close');
    
    if (modal && modalImg) {
        document.querySelectorAll('.merke-preview-btn').forEach(preview => {
            preview.addEventListener('click', () => {
                const imgSrc = preview.getAttribute('data-src');
                console.log('Opening modal with image:', imgSrc);
                modal.style.display = "block";
                modalImg.src = imgSrc;
            });
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = "none";
            });
        }
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const type = btn.getAttribute('data-type');
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
});
