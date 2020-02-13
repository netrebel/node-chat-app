const users = [];

// addUser
const addUser = ({ id, username, room }) => {
	// Clean the data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	// Validate the data
	if (!username || !room) {
		return {
			error: 'Username and room are required'
		}
	}

	// Check for existing user
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username
	})

	// Validate username
	if (existingUser) {
		return {
			error: 'Username is in use!'
		}
	}

	// Store user
	const user = { id, username, room }
	users.push(user)
	return { user }
}

// removeUser
const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id)
	if (index !== -1) {
		// 1 removes one item in the list
		// Return the object removed [0]
		return users.splice(index, 1)[0];
	}
}

// getUser

// getUsersInRoom