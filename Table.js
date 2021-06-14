import React from "react";
import numeral from "numeral";
import "./Table.css";

//Map through countries list and return the following items
//destructuring is done in line 8 itself or could be done in td with props change
function Table({ countries}) {
    return (
    <div className="table">
        
        {countries.map(({country, cases}) => (
         
         <tr>
             <td>{country}</td>
             <td>
                 <strong>{numeral(cases).format("0,0")}</strong>
            </td>
         </tr>

        ))}
    </div>
    ); 
}

export default Table;
