import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MaintenanceContext = createContext();

const API_URL = "http://127.0.0.1:8001/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const user = localStorage.getItem('gearguard_user');
    if (user) {
        const { token } = JSON.parse(user);
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }
    return { 'Content-Type': 'application/json' };
};

export function MaintenanceProvider({ children }) {
    const [equipment, setEquipment] = useState([]);
    const [teams, setTeams] = useState([]);
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [workCenters, setWorkCenters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [eqRes, teamRes, techRes, reqRes, wcRes, catRes] = await Promise.all([
                fetch(`${API_URL}/equipment`),
                fetch(`${API_URL}/teams`),
                fetch(`${API_URL}/technicians`),
                fetch(`${API_URL}/requests`),
                fetch(`${API_URL}/work-centers`),
                fetch(`${API_URL}/equipment-categories`)
            ]);

            const [eqData, teamData, techData, reqData, wcData, catData] = await Promise.all([
                eqRes.json(),
                teamRes.json(),
                techRes.json(),
                reqRes.json(),
                wcRes.json(),
                catRes.json()
            ]);

            setEquipment(eqData);
            setTeams(teamData);
            setTechnicians(techData);
            setRequests(reqData);
            setWorkCenters(wcData);
            setCategories(catData);
        } catch (error) {
            console.error("Error fetching data from PostgreSQL:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addRequest = async (reqData) => {
        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(reqData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error adding request:", error);
        }
    };

    const updateRequest = async (reqId, reqData) => {
        try {
            const response = await fetch(`${API_URL}/requests/${reqId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(reqData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error updating request:", error);
        }
    };

    const updateRequestStage = async (reqId, stage) => {
        try {
            const response = await fetch(`${API_URL}/requests/${reqId}/stage?stage=${stage}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error updating stage:", error);
        }
    };

    const deleteRequest = async (reqId) => {
        try {
            const response = await fetch(`${API_URL}/requests/${reqId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error deleting request:", error);
        }
    };

    const addEquipment = async (eqData) => {
        try {
            const response = await fetch(`${API_URL}/equipment`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(eqData)
            });
            if (response.ok) {
                const data = await response.json();
                fetchData();
                return data;
            }
        } catch (error) {
            console.error("Error adding equipment:", error);
        }
    };

    const updateEquipment = async (eqId, eqData) => {
        try {
            const response = await fetch(`${API_URL}/equipment/${eqId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(eqData)
            });
            if (response.ok) {
                const data = await response.json();
                fetchData();
                return data;
            }
        } catch (error) {
            console.error("Error updating equipment:", error);
        }
    };

    const deleteEquipment = async (eqId) => {
        try {
            const response = await fetch(`${API_URL}/equipment/${eqId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error deleting equipment:", error);
        }
    };

    const addTeam = async (teamData) => {
        try {
            const response = await fetch(`${API_URL}/teams`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(teamData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error adding team:", error);
        }
    };

    const updateTeam = async (teamId, teamData) => {
        try {
            const response = await fetch(`${API_URL}/teams/${teamId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(teamData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error updating team:", error);
        }
    };

    const deleteTeam = async (teamId) => {
        try {
            const response = await fetch(`${API_URL}/teams/${teamId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    const addTechnician = async (techData) => {
        try {
            const response = await fetch(`${API_URL}/technicians`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(techData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error adding technician:", error);
        }
    };

    const updateTechnician = async (techId, techData) => {
        try {
            const response = await fetch(`${API_URL}/technicians/${techId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(techData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error updating technician:", error);
        }
    };

    const deleteTechnician = async (techId) => {
        try {
            const response = await fetch(`${API_URL}/technicians/${techId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error deleting technician:", error);
        }
    };

    const addWorkCenter = async (wcData) => {
        try {
            const response = await fetch(`${API_URL}/work-centers`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(wcData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error adding work center:", error);
        }
    };

    const updateWorkCenter = async (wcId, wcData) => {
        try {
            const response = await fetch(`${API_URL}/work-centers/${wcId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(wcData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error updating work center:", error);
        }
    };

    const deleteWorkCenter = async (wcId) => {
        try {
            const response = await fetch(`${API_URL}/work-centers/${wcId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error deleting work center:", error);
        }
    };

    const addEquipmentCategory = async (catData) => {
        try {
            const response = await fetch(`${API_URL}/equipment-categories`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(catData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const updateEquipmentCategory = async (catId, catData) => {
        try {
            const response = await fetch(`${API_URL}/equipment-categories/${catId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(catData)
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const deleteEquipmentCategory = async (catId) => {
        try {
            const response = await fetch(`${API_URL}/equipment-categories/${catId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const getEquipmentRequests = useCallback((eqId) => {
        return requests.filter(r => r.equipment_id === eqId);
    }, [requests]);

    const getSimilarEquipment = useCallback((eqId) => {
        const target = equipment.find(e => e.id === eqId);
        if (!target) return [];

        return equipment
            .filter(e => e.id !== eqId)
            .map(e => {
                const labelsMatch = e.name.toLowerCase().split(' ')[0] === target.name.toLowerCase().split(' ')[0];
                const targetReqs = getEquipmentRequests(target.id);
                const compareReqs = getEquipmentRequests(e.id);
                const commonIssues = targetReqs.filter(tr =>
                    compareReqs.some(cr => cr.subject.toLowerCase() === tr.subject.toLowerCase())
                );

                if (labelsMatch || commonIssues.length > 0) {
                    return {
                        equipment: e,
                        similarRequests: commonIssues,
                        reason: labelsMatch ? "Similar Asset Type" : "Common Maintenance Issues"
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [equipment, getEquipmentRequests]);

    const getTechnicianLoad = useCallback((techId) => {
        const techRequests = requests.filter(r =>
            r.technician_id === techId &&
            r.stage !== 'Repaired' &&
            r.stage !== 'Scrap'
        );
        // Assuming base capacity is 4 active requests for 100% load
        const load = (techRequests.length / 4) * 100;
        return Math.min(Math.round(load), 100);
    }, [requests]);

    const value = {
        equipment,
        teams,
        requests,
        technicians,
        workCenters,
        categories,
        loading,
        addRequest,
        updateRequest,
        updateRequestStage,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addEquipmentCategory,
        updateEquipmentCategory,
        deleteEquipmentCategory,
        addTeam,
        updateTeam,
        deleteTeam,
        addTechnician,
        updateTechnician,
        deleteTechnician,
        addWorkCenter,
        updateWorkCenter,
        deleteWorkCenter,
        getEquipmentRequests,
        getSimilarEquipment,
        getTechnicianLoad,
        getTechnicianLoad,
        deleteRequest,
        refreshData: fetchData
    };

    return (
        <MaintenanceContext.Provider value={value}>
            {children}
        </MaintenanceContext.Provider>
    );
}

export function useMaintenance() {
    const context = useContext(MaintenanceContext);
    if (!context) throw new Error('useMaintenance must be used within a MaintenanceProvider');
    return context;
}
