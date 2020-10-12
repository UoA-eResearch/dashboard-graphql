import { RESTDataSource } from 'apollo-datasource-rest';
import { performance } from 'perf_hooks';

export class EResearchProjectAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PROJECT_DB_BASE_URL;
    this.apiKey = process.env.PROJECT_DB_API_KEY;
  }

  willSendRequest(request) {
    request.headers.set('apikey', this.apiKey);
  }

  async personFindByIdentity(username) {
    return this.get(`person/findByIdentity/${username}`);
  }

  async getPeople() {
    return this.get('person');
  }

  async getPerson(id) {
    return this.get(`person/${id}`);
  }

  async getProjects() {
    const t0 = performance.now();
    const result = this.get('project');
    const t1 = performance.now();
    console.log(`Call to getUserInfo took ${t1 - t0} milliseconds.`);
    return result;
  }

  async getProject(id) {
    return this.get(`project/${id}`);
  }

  async getVM(id) {
    // this returns entire vm history so need to return only the basic data
    const dataList = await this.get(`vm/${id}`);
    let data;
    if (dataList.length > 0) {
      data = dataList[0];
      // the id field is named vm_id so add id field to match schema
      // this makes data more consistent for front end
      if (data.hasOwnProperty('vm_id')) {
        data['id'] = data.vm_id;
      }
    }
    return data;
  }

  async getResearchDrive(id) {
    // this returns entire drive history so need to return only the basic data
    const dataList = await this.get(`researchdrive/${id}`);
    let data;
    if (dataList.length > 0) {
      data = dataList[0];
      // the id field is named drive_id so add id field to match schema
      // this makes data more consistent for front end
      if (data.hasOwnProperty('drive_id')) {
        data['id'] = data.drive_id;
      }
    }
    return data;
  }

  async getNectar(id) {
    // this returns entire nectar history so need to return only
    // the basic data
    const dataList = await this.get(`nectar/${id}`);
    let data;
    if (dataList.length > 0) {
      data = dataList[0];
      // the id field is named service_id so add id field to match schema
      // this makes data more consistent for front end
      if (data.hasOwnProperty('service_id')) {
        data['id'] = data.service_id;
      }
    }
    return data;
  }

  async getDropbox(id) {
    return this.get(`dropbox/${id}`);
  }

  async getVis(id) {
    return this.get(`vis/${id}`);
  }
}
