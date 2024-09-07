'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    address: '', 
    group: '', 
    image: ''
  });

  useEffect(() => {
    fetchContacts();
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost/con/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'getContacts' }),
      });
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost/con/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'getGroups' }),
      });
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/con/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'getUsers' }),
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleView = (index) => {
    setSelectedContact(contacts[index]);
    setViewModal(true);
  };

  const handleEdit = (index) => {
    const contact = contacts[index];
    setFormData({
      name: contact.contact_name,
      phone: contact.contact_phone,
      email: contact.contact_email || '',
      address: contact.contact_address || '',
      group: contact.grp_id || '',
      image: contact.contact_image || ''
    });
    setEditIndex(index);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    const contact = contacts[editIndex];
    try {
      const response = await fetch('http://localhost/con/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'updateContact',
          contact_id: contact.contact_id,
          contact_name: formData.name,
          contact_phone: formData.phone,
          contact_email: formData.email,
          contact_address: formData.address,
          contact_group: formData.group,
          contact_image: formData.image,
        }),
      });
      const data = await response.json();
      if (data.status === 1) {
        fetchContacts();
        setEditModal(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDelete = (index) => {
    setSelectedContact(contacts[index]);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch('http://localhost/con/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'deleteContact',
          contact_id: selectedContact.contact_id,
        }),
      });
      const data = await response.json();
      if (data.status === 1) {
        fetchContacts();
        setDeleteModal(false);
        setViewModal(false); // Close the view modal after deletion
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-8 ml-8 text-left">Contact Manager</h1>
      <div className="w-2/3 bg-gray-800 p-4 rounded-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Contact Records</h2>
        <table className="w-full bg-gray-700 rounded-lg">
          <thead>
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.contact_id} className="border-b border-gray-600">
                <td className="p-2">{contact.contact_name}</td>
                <td className="p-2">{contact.contact_phone}</td>
                <td className="p-2">
                  <button onClick={() => handleView(index)} className="mr-2 p-1 bg-blue-500 text-white rounded">
                    View
                  </button>
                  <button onClick={() => handleEdit(index)} className="mr-2 p-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)} className="p-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-black w-1/3">
            <h2 className="text-xl font-bold mb-4">View Contact</h2>
            <p><strong>Name:</strong> {selectedContact.contact_name}</p>
            <p><strong>Phone:</strong> {selectedContact.contact_phone}</p>
            <p><strong>Email:</strong> {selectedContact.contact_email}</p>
            <p><strong>Address:</strong> {selectedContact.contact_address}</p>
            <p><strong>Group:</strong> {selectedContact.grp_name}</p>
            <p><strong>User:</strong> {selectedContact.usr_fullname}</p>
            {selectedContact.contact_image && (
              <img 
                src={`http://localhost/contacts/images/${selectedContact.contact_image}`} 
                alt="Contact" 
                className="mt-2 w-full"
              />
            )}
            <div className="flex justify-between mt-4">
              <button onClick={() => setViewModal(false)} className="p-2 bg-blue-500 text-white rounded">Close</button>
              <button onClick={() => handleDelete(contacts.findIndex(c => c.contact_id === selectedContact.contact_id))} className="p-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-black w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Group</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Group</option>
                  {groups.map((group) => (
                    <option key={group.grp_id} value={group.grp_id}>
                      {group.grp_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button onClick={handleEditSubmit} className="p-2 bg-green-500 text-white rounded">Save Changes</button>
                <button onClick={() => setEditModal(false)} className="p-2 bg-gray-500 text-white rounded">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-black w-1/3">
            <h2 className="text-xl font-bold mb-4">Delete Contact</h2>
            <p>Are you sure you want to delete {selectedContact.contact_name}?</p>
            <div className="flex justify-between mt-4">
              <button onClick={confirmDelete} className="p-2 bg-red-500 text-white rounded">Yes, Delete</button>
              <button onClick={() => setDeleteModal(false)} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
