import React, {useEffect, useState} from 'react';
import api from '../api/api';

export default function Drivers(){
  const [docs, setDocs] = useState([]);
  useEffect(()=> {
    api.get('/admin/documents/pending').then(r=> setDocs(r.data.docs));
  }, []);
  async function approve(id, action){
    await api.post(`/admin/documents/${id}`, { action });
    setDocs(d => d.filter(x=> x._id !== id));
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl">Pending Documents</h1>
      <div className="grid gap-4 mt-4">
        {docs.map(d => (
          <div key={d._id} className="p-4 border rounded">
            <div>{d.driver.name} - {d.type}</div>
            <img src={d.fileUrl} alt="" className="w-64" />
            <div className="mt-2">
              <button onClick={()=> approve(d._id, 'approve')} className="btn mr-2">Approve</button>
              <button onClick={()=> approve(d._id, 'reject')} className="btn">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
