document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Function to show the role modification form when "Edit Role" is clicked
        function editRole(userId) {
            const editRoleForm = document.getElementById('editRoleForm');
            const newRoleSelect = document.getElementById('newRole');
            newRoleSelect.setAttribute('data-user-id', userId);
            editRoleForm.style.display = 'block';
        }

        // Function to save the user's modified role
        async function saveRole() {
            const newRoleSelect = document.getElementById('newRole');
            const userId = newRoleSelect.getAttribute('data-user-id');
            const newRole = newRoleSelect.value;

            try {
                const response = await fetch(`/api/users/${userId}/role`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ role: newRole }),
                });

                if (response.ok) {
                    // Successfully updated the role
                    // You can update the view or take other actions here
                } else {
                    throw new Error(`Failed to update user role. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Function to delete a user
        async function deleteUser(userId) {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Successfully deleted the user
                    // You can update the view or take other actions here
                } else {
                    throw Error(`Failed to delete user. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
});