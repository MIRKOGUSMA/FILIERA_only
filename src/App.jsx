import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './components/Modal';

function App() {
  const [rows, setRows] = useState([]);
  const [daFare, setDaFare] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/production');
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columnTotals = rows.reduce(
    (totals, row) => {
      totals.filagne += Number(row.filagne || 0);
      totals.intestate += Number(row.intestate || 0);
      return totals;
    },
    { filagne: 0, intestate: 0 }
  );

  const totaliLavorati = columnTotals.filagne + columnTotals.intestate;
  const rimanenti = Number(daFare) - totaliLavorati;

  const addRow = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: new Date().toLocaleDateString('it-IT'),
          filo: '',
          frese: '',
          spessori: '',
          filagne: '',
          intestate: '',
        }),
      });

      if (response.ok) {
        const newRow = await response.json();
        setRows((prevRows) => [...prevRows, newRow]);
      }
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const updateCell = async (rowIndex, field, value) => {
    try {
      const updatedRow = { ...rows[rowIndex], [field]: value };
      const response = await fetch(`http://localhost:3000/api/production/${rows[rowIndex].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRow),
      });

      if (response.ok) {
        setRows((prevRows) =>
          prevRows.map((row, idx) => (idx === rowIndex ? updatedRow : row))
        );
      }
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div>
          <span>Da Fare</span>
          <input
            type="number"
            value={daFare}
            onChange={(e) => setDaFare(e.target.value)}
            className="border ml-2 p-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <span>Lavorati: </span>
          <span className="font-bold">{totaliLavorati}</span>
        </div>

        <div>
          <span>Rimanenti: </span>
          <span className="text-red-500 font-bold">{rimanenti}</span>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Mostra Filiera
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Tabella Produzione</h2>
          <button
            onClick={addRow}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Aggiungi Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Data', 'Filo', 'Frese', 'Spessori', 'Filagne', 'Intestate'].map((header) => (
                  <th key={header} className="border p-2 bg-gray-200 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border p-2">{row.data}</td>
                  {['filo', 'frese', 'spessori', 'filagne', 'intestate'].map((field) => (
                    <td key={field} className="border p-2">
                      <input
                        type="number"
                        value={row[field]}
                        onChange={(e) => updateCell(rowIndex, field, e.target.value)}
                        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="border p-2 text-right font-bold">Totali</td>
                <td className="border p-2 text-center text-blue-600 font-bold">
                  {columnTotals.filagne}
                </td>
                <td className="border p-2 text-center text-blue-600 font-bold">
                  {columnTotals.intestate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

export default App;