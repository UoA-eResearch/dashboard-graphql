
// raw personFindByIdentityResponse response from eRes API
export const mockPersonFindByIdentityResponse = {
  divisions: {
    href: '/person/1374/division',
  },
  email: 'rmcc872@uoa.auckland.ac.nz',
  end_date: '',
  full_name: 'Rose McColl',
  href: '/person/1374',
  id: 1374,
  identities: {
    href: '/person/1374/identity',
  },
  last_modified: '2020-03-26T00:50:44Z',
  notes: '',
  phone: '',
  preferred_name: '',
  projects: {
    href: '/person/1374/project',
  },
  properties: {
    href: '/person/1374/property',
  },
  start_date: '2020-03-26',
  status: {
    href: '/personstatus/1',
  },
};

export const mockGetPersonResponse = {
  divisions: {
    href: '/person/1374/division',
  },
  email: 'rmcc872@uoa.auckland.ac.nz',
  end_date: '',
  full_name: 'Rose McColl',
  href: '/person/1374',
  id: 1374,
  identities: {
    href: '/person/1374/identity',
  },
  last_modified: '2020-03-26T00:50:44Z',
  notes: '',
  phone: '',
  preferred_name: '',
  projects: {
    href: '/person/1374/project',
  },
  properties: {
    href: '/person/1374/property',
  },
  start_date: '2020-03-26',
  status: {
    href: '/personstatus/1',
  },
};

export const mockGetProjectResponse = {
  actions: {
    href: '/project/1/action',
  },
  codes: {
    href: '/project/1/code',
  },
  creation_date: '2019-12-20T02:59:51Z',
  description: `Driving a car, typing a letter, buttoning a shirt, these 
  are all feats of movement that most of us take for granted. However, a 
  marked loss of movement function has debilitating consequences for 
  individuals with movement disorders such as Parkinson's disease, 
  dystonia or after a brain injury, which may occur with cerebral palsy 
  or following a stroke or other trauma. An appreciation of neuroscience 
  principles underlying the preparation, planning and execution of movement
   can lead to a structured approach for developing novel rehabilitation 
   strategies for people with impaired movement ability. The development 
   of novel rehabilitation strategies is the goal of our research`,
  division: 'SPORTS',
  end_date: '2019-04-18',
  external_references: {
    href: '/project/1/externalreference',
  },
  href: '/project/1',
  id: 1,
  last_modified: '2019-12-20T02:59:51Z',
  members: {
    href: '/project/1/member',
  },
  next_review_date: '',
  notes: `Job submission characteristics prior to using NeSI 
  facilities:<br>Number CPU Cores used: 4<br>Amount of memory[GB] 
  used: 8<br>Number Concurrent Jobs: 1<br><br>Several files are 
  needed for LL submission interface to work. These can be found in the
   NeSI Git repo: <b>git@crypt.nesi.org.nz:eresearch.git</b> under the 
   folder <b>eresearch/compute/apps/fsl<br><br>James and Matt still need
    access to this project even though they are no longer with UoA<br><br></b>`,
  properties: {
    href: '/project/1/property',
  },
  requirements: `High storage use (projected runtime storage can be as high
     as 2-3 TB) and computationally intensive applications places significant
      load on the cluster. Separate group needs to be created in order to 
      facilitate shared computational access to data. Requires installation
       of FSL suite and modification of FSL SGE submission interface to work
        with LoadLeveler.`,
  research_outputs: {
    href: '/project/1/researchoutput',
  },
  services: {
    href: '/project/1/service',
  },
  start_date: '2012-04-16',
  status: {
    href: '/projectstatus/1',
  },
  title: 'Movement Disorders and Rehabilitation',
  todo: '',
};

export const mockGetVmResponse = {
  cpus: 4,
  date: '2019-06-07',
  deleted: 0,
  host: 'd1esx079.its.auckland.ac.nz',
  memory_gb: 16.0,
  name: 'ceratriprd01',
  os: 'Microsoft Windows Server 2012 (64-bit)',
  state: 'poweredOn',
  total_disk_gb: 550.0,
  uuid: '501a3683-5586-b98d-58e1-dac3bcc4959f',
  vm_id: 1,
  id: 1,
};

export const mockGetResearchDriveResponse = {
  allocated_gb: 512.0,
  date: '2018-10-06',
  deleted: 0,
  drive_id: 1,
  free_gb: 512.0,
  name: 'reseng201800030-ssc',
  num_files: 3,
  percentage_used: 0.0,
  used_gb: 0.0,
  id: 1,
};

export const mockGetNectarResponse = {
  core: 0,
  cpu_optimised: 0,
  database_server: 0,
  database_storage: 0,
  date: '2019-09-12',
  deleted: 0,
  floating_ip: 0,
  instance: 0,
  load_balancer: 0,
  name: 'active_learning',
  network: 0,
  object_store: 0,
  ram: 0,
  ram_optimised: 0,
  router: 0,
  service_id: 1,
  shared_fs: 0,
  status: 'Submitted',
  volume: 0,
  id: 1,
};

export const mockGetDropboxResponse = {
  deleted: 1,
  editor_group: '',
  href: '/dropbox/1',
  id: 1,
  name: 'Rob_Testing',
  team_folder_id_dbx: '3006443744',
  viewer_group: '',
};

export const mockGetVisResponse = {
  deleted: 0,
  gear_vr: 0,
  holo_lens: 0,
  href: '/vis/1',
  id: 1,
  name: 'legacy',
  video_based_vis: 0,
  vive: 0,
  web_based_vis: 0,
};
