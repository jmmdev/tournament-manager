![splash-screen](https://github.com/jmmdev/tournament-manager/assets/100143610/a072f2c8-c715-43f1-8d56-68d1112d6184)

<br></br>
Tournament Manager is a native mobile application crafted to assist tournament organizers on start.gg with their tasks. Recognizing the sluggishness and inefficiency of the mobile version of the website, I aimed to provide a more responsive and user-friendly alternative. While leveraging the official start.gg API helps mitigate some performance issues, complete eradication of delays may not be achievable. Currently in its early stages of development, the application boasts a valuable core feature: streamlined reporting of match results. Although the project is temporarily paused, it is available for testing. Please refer to the guide below for a quick overview.

<br></br>
The journey begins with the splash, login, and authorization screens. Users initiate the process by authenticating their start.gg credentials and granting requisite access via the start.gg OAuth service.<br></br>

![screen-1](https://github.com/jmmdev/tournament-manager/assets/100143610/983676aa-6643-452b-bab3-b2002fc27aaf)

<br></br>
Upon successful authentication, users are greeted with a list of tournaments. Presently, the list is filtered to showcase tournaments where users hold "admin" privileges, those being ownership, administration, or reporting roles. Future iterations will broaden accessibility to more casual features so the filter will no longer be needed.
<br></br>

![screen-2](https://github.com/jmmdev/tournament-manager/assets/100143610/3a086f39-461c-4809-b2a3-50a9b8fcf529)

<br></br>
From there, users navigate through the tournament's events, phases, and groups as needed. This hierarchical approach optimizes performance by facilitating multiple smaller queries, enhancing responsiveness. The sets view provides a comprehensive snapshot of match configurations, enabling efficient management.
<br></br>

![screen-2](https://github.com/jmmdev/tournament-manager/assets/100143610/d2d6ebd2-9106-40ae-a02f-6ccf6acd5cee)

<br></br>
Within the sets view, users access multiple functionalities, including marking sets as "in progress," access to start.gg aditional tools via web browser, and match result reporting. The reporting interface offers two modes: quick report and detailed report, with designs imitating those in the website version.
<br></br>

![screen-4](https://github.com/jmmdev/tournament-manager/assets/100143610/c3ba8f36-17a8-4499-a36f-55dddc9d14f8) 

<br></br>
Upon reporting, completed sets are dynamically updated within the list, ensuring clarity and facilitating navigation. By default, these sets are hidden to optimize display space, with an option provided to toggle visibility as needed. Notably, modifying completed sets requires intervention via the web interface due to API limitations.
<br></br>

![screen-5](https://github.com/jmmdev/tournament-manager/assets/100143610/876042fa-1d4b-43fc-9dff-9ce8a316fe9d)
