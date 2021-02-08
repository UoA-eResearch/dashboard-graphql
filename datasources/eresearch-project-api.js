import { RESTDataSource } from 'apollo-datasource-rest';

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
    const result = this.get('project');
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
    const data = await this.get(`dropbox/${id}`);

    // merge dropbox groups into one object to be consistent with
    // other service types (storage drive and vm)
    data['groups'] = {};
    if (data.hasOwnProperty('editor_group')) {
      data['groups']['editor_group'] = data['editor_group'];
    }
    if (data.hasOwnProperty('viewer_group')) {
      data['groups']['viewer_group'] = data['viewer_group'];
    }

    return data;
  }

  async getVis(id) {
    return this.get(`vis/${id}`);
  }
}
