import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../Context/Context';
import api from '../Component/api';
import Navbar from '../Component/Navbar';
import "./Category.css";
import Footer from '../Component/Footer';
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';

const Category = () => {
    const [showForm, setShowForm] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    let { state } = useContext(GlobalContext);

    const getCategory = async () => {
        try {
            let res = await api.get(`/categories`);
            if (res.status === 200) {
                setCategoryList(res.data.category_list);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/category/${editId}`, {
                    name: categoryName,
                    description: categoryDescription
                });
            } else {
                await api.post(`/category`, {
                    name: categoryName,
                    description: categoryDescription
                });
            }
            getCategory();
            resetForm();
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleEdit = (cat) => {
        setCategoryName(cat.category_name);
        setCategoryDescription(cat.description);
        setEditId(cat.category_id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setCategoryName("");
        setCategoryDescription("");
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/category/${id}`);
            setCategoryList(categoryList.filter((cat) => cat.category_id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
            alert(error.response?.data?.message || "Delete failed!");
        }
    };

    return (
        <div className="category-page">
            <Navbar />

            <div className="category-container">
                <div className="category-header">
                    <div className="header-text">
                        <h2>Collections</h2>
                        <p>Manage your boutique's product categories</p>
                    </div>
                    <button className={showForm ? "add-btn cancel" : "add-btn"} onClick={() => showForm ? resetForm() : setShowForm(true)}>
                        {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Category</>}
                    </button>
                </div>

                {showForm && (
                    <div className="form-box">
                        <h3>{isEditing ? "Edit Category" : "Add New Category"}</h3>
                        <form onSubmit={addCategory}>
                            <div className="input-field">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Summer Essentials"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label>Description</label>
                                <input
                                    type="text"
                                    placeholder="Short description..."
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn primary">
                                    {isEditing ? "Update Category" : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th width="10%">ID</th>
                                <th width="30%">Category Name</th>
                                <th width="40%">Description</th>
                                <th width="20%" style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryList.map((eachCategory, i) => (
                                <tr key={i}>
                                    <td>
                                        <span className="cat-id">#{eachCategory?.category_id}</span>
                                    </td>
                                    <td>
                                        <div className="cat-name">{eachCategory?.category_name}</div>
                                    </td>
                                    <td>
                                        <div className="cat-desc">{eachCategory?.description}</div>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            <button 
                                                className="icon-btn cat-edit-btn" 
                                                onClick={() => handleEdit(eachCategory)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="icon-btn cat-delete-btn" 
                                                onClick={() => deleteCategory(eachCategory.category_id)}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Category;
