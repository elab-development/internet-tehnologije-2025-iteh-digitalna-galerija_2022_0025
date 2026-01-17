import React, { useState, useEffect } from 'react';
import './AboutUs.css'; 
import jana from '../images/ktehjana.jpg';
import kristina from '../images/kethkristina.jpg';
import ema from '../images/ktehema.jpg';

interface TeamMember {
  name: string;
  position: string;
  department: string; 
  image: string; 
}

const team: TeamMember[] = [
  { name: "Jana Ostojić", position: "Software Developer", department: "Engineering", image: jana },
  { name: "Kristina Pantelić", position: "Marketing Manager", department: "Marketing", image: kristina },
  { name: "Emilija Nikolić", position: "HR Specialist", department: "Human Resources", image: ema },
];

interface AboutUsProps {
  filterTeamByDepartment?: (department: string) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ filterTeamByDepartment }) => {
  const [filteredDepartment, setFilteredDepartment] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'About Us';
  }, []);

  const handleFilterTeamByDepartment = (department: string | null) => {
    setFilteredDepartment(department);
    if (filterTeamByDepartment && department) {
      filterTeamByDepartment(department);
    }
  };

  const filteredTeam = filteredDepartment 
    ? team.filter(member => member.department === filteredDepartment) 
    : team;

  return (
    <div className="about-container">
      <h1>Our Creative Team</h1>

      <div className="filters">
        <button 
          className={filteredDepartment === null ? 'active' : ''} 
          onClick={() => handleFilterTeamByDepartment(null)}
        >
          All Team
        </button>
        <button 
          className={filteredDepartment === "Engineering" ? 'active' : ''} 
          onClick={() => handleFilterTeamByDepartment("Engineering")}
        >
          Engineering
        </button>
        <button 
          className={filteredDepartment === "Marketing" ? 'active' : ''} 
          onClick={() => handleFilterTeamByDepartment("Marketing")}
        >
          Marketing
        </button>
        <button 
          className={filteredDepartment === "Human Resources" ? 'active' : ''} 
          onClick={() => handleFilterTeamByDepartment("Human Resources")}
        >
          HR
        </button>
      </div>

      <div className="team">
        {filteredTeam.map(member => (
          <div key={member.name} className="team-member">
            <img src={member.image} alt={member.name} />
            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="position">{member.position}</p>
              <span className="dept-tag">{member.department}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;