import React, { useEffect, useState } from 'react';
import './Company.css';
import { Link } from 'react-router-dom';

  const Company = () => {
	const [company, setCompany] = useState({});
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [counts, setCounts] = useState([]);
  const [change, setChange] = useState("");
  const [showChange, setshowChange] = useState(false);

  const TableRow = ({
    className,
    onClick,
    id,
    avatar,
    name,
    title,
    country
  }) => (
    <div className={className}>
      <div className="companies_row-cell">
        <img src={avatar} alt={name} />
      </div>
      <div className="companies_row-cell">{name}</div>
      <div className="companies_row-cell">{title}</div>
      <div className="companies_row-cell">{country}</div>
    </div>
  );

	// fetch the company data from the backend
	useEffect(() => {
    const id = window.location.pathname.split('/')[2];
		async function getEmployees() {
			const response = await fetch(`/companies/${id}`);
			const { message, data } = await response.json();
			if (message === 'success') {
        let departments = [];
        let comp = {}
        let counts = {}
        data.forEach(item => {
          item.department = item.department.replace(/\s/g, '');
          if (counts[item.department]) {
            counts[item.department]++;
          } else {
            counts[item.department] = 1;
            departments.push(item.department);
            // yes, I know it's overriding each time. If I had more time I'd fix this better
            comp.name = item.company;
            comp.segment = item.segment;
            comp.region = item.region;
            comp.industry = item.industry;
          }
        });
        comp.company_id = id
        setCompany(comp)
        setChange(comp.name)
        setDepartments(departments);
        setEmployees(data);
        setCounts(counts);
			}
		}
		getEmployees();
	}, []);

  const nameClick = (e) => {
    e.preventDefault();
    const newname = e.target.innerText;
    setChange(newname);
  }

  const changeCompanyName = (e) => {
    e.preventDefault();
    const id = company.company_id;
    const newname = change;
    async function changeName() {
      const response = await fetch(`/companies/edit/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: newname
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const { message } = await response.json();
      if (message === 'success') {
        setshowChange(false);
        setCompany({...company, name: newname});
      }
    }
    changeName();
  }

  const openChange = () => {
    setshowChange(true);
  }

	return (
    <div>
      {showChange &&
        <div>
          <div className="overlay"></div>
          <div className="modal">
            <div className="close" onClick={(e) => setshowChange(false)}>x</div>
            <h2>Change Company Name</h2>  
            <input type="text" value={change} onChange={(e) => setChange(e.target.value)} />
            <button className="button-outline" onClick={changeCompanyName}>Change Company Name to {change}</button>
          </div>
        </div>
      }
      <div className="company-container">
        <h1>{company.name}</h1>
        <button className="button small-button" onClick={openChange}>Change company name</button>
        <div className="company_info">
          <div>Segment: {company.segment}</div>
          <div>Region: {company.region}</div>
          <div>Industry: {company.industry}</div>
        </div>
        <div className="company">
          {departments.map((department, index) => {
              return (
              <div className="department" key={index}>
                <div className="department_header">
                  {department} -- {counts[department]} people
                </div>
                <div className="company_header">
                  <div className="companies_row-cell">Avatar</div>
                  <div className="companies_row-cell">Name</div>
                  <div className="companies_row-cell">Title</div>
                  <div className="companies_row-cell">Country</div>
                </div>
                {employees.map(employee => {
                  if (employee.department === department) {
                    return (
                      <TableRow
                        key={employee.id}
                        className="company_row"
                        {...employee}
                        />
                    )
                  }
                })}
              </div>
              )
          })}
        </div>
      </div>
    </div>
	);
};

export default Company;
