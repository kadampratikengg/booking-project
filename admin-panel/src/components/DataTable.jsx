export default function DataTable({ columns, data }) {
    return (
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
  
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c}>{row[c.toLowerCase()] || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  