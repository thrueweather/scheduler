import moment from "moment";
import { TOKEN } from "../constants";

export const loadData = key => {
  const data = JSON.parse(window.localStorage.getItem(key));
  if (data) {
    const timeDiff = Math.abs(data.timestamp - new Date().getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 1) {
      window.localStorage.removeItem("token");
      return "";
    }
    return data.token;
  }
  return "";
};

export const headersAuthorization = ({ headers }) => {
  let data = "";
  try {
    const token = localStorage.getItem(TOKEN);
    data = token ? JSON.parse(token).token : "";
  } catch (error) {}
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${data}`
    }
  };
};

export const saveData = (key, value) => {
  const timestamp = +new Date();
  const data = JSON.stringify({ token: value, timestamp });
  window.localStorage.setItem(key, data);
};

export const saveState = state => {
  try {
    const serializeState = JSON.stringify(state);
    localStorage.setItem("state", serializeState);
  } catch (error) {
    return false;
  }
};

export const loadState = () => {
  try {
    const serializeState = localStorage.getItem("state");
    if (serializeState) {
      return JSON.parse(serializeState);
    }
  } catch (error) {
    return false;
  }
};

export const withPromise = f => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(f);
    }, 200);
  });
};

export const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const timeInterval = (endDate, startDate, type, boolean) =>
  moment(endDate)
    .diff(moment(startDate), type, boolean)
    .toFixed(1);

export const groups = getSuperintendents => {
  if (getSuperintendents.persons) {
    const groups = getSuperintendents.persons.map(person => ({
      id: person.id,
      title: `${person.firstName} ${person.lastName}`
    }));
    return groups;
  }
};

export const projects = getProjects => {
  let projectsList = getProjects.projects;
  let projects = [];
  if (projectsList && projectsList.length) {
    projectsList.forEach(project => {
      if (project.superintendent !== null) {
        projects.push({
          id: project.id,
          projectId: project.id,
          title: project.name,
          superintendent: project.superintendent,
          manager: project.manager,
          group: project.superintendent.id,
          start_time: moment(project.startDate),
          end_time: moment(project.endDate),
          bgColor: project.manager.color,
          phase: project.phase
        });
      }
    });
  }
  return projects;
};

export const unassignedProjects = getProjects => {
  let projects = [];
  getProjects.projects &&
    getProjects.projects.map(project => {
      if (!project.superintendent) {
        projects.push(project);
      }
      return null;
    });
  return projects;
};
