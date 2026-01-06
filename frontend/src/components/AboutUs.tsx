import React, { useState } from 'react';
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

  const handleFilterTeamByDepartment = (department: string) => {
    setFilteredDepartment(department);
    if (filterTeamByDepartment) {
      filterTeamByDepartment(department);
    }
  };


  const displayTeamMembers = () => {
    const filteredTeam = filteredDepartment ? team.filter(member => member.department === filteredDepartment) : team;
    return filteredTeam.map(member => (
      <div key={member.name} className="team-member">
        <img src={member.image} alt={member.name} />
        <div>
          <h3>{member.name}</h3>
          <p>{member.position}</p>
          <p>{member.department}</p>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="filters">
        <button onClick={() => handleFilterTeamByDepartment("Engineering")}>Engineering</button>
        <button onClick={() => handleFilterTeamByDepartment("Marketing")}>Marketing</button>
        <button onClick={() => handleFilterTeamByDepartment("Human Resources")}>Human Resources</button>
      </div>

      <div className="team">{displayTeamMembers()}</div>
    </div>
  );
};

export default AboutUs;
