const GetTeamCard = async (params: any) => {
  let _result = await fetch(
    `${import.meta.env.VITE_SERVER_PATH}game/team-card`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ params }),
    }
  )
    .then((res) => res.json())
    .then((d) => d)
    .catch((err) => {
      return { code: 500 };
    });

  return { code: _result.code, items: _result.data };
};

const SetTeam = async (params: any) => {
  let _result_upload: any = { code: 200 };

  if (params.logo !== "ok") {
    _result_upload = await fetch(
      `${import.meta.env.VITE_SERVER_PATH}game/upload`,
      {
        method: "POST",
        credentials: "include",
        body: params.logo,
      }
    )
      .then((res) => res.json())
      .then((d) => d)
      .catch((err) => {
        return { code: 500 };
      });
  }

  if (_result_upload.code === 200) {
    let _result = await fetch(
      `${import.meta.env.VITE_SERVER_PATH}game/save-team`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teamName: params.name, teams: params.teams }),
      }
    )
      .then((res) => res.json())
      .then((d) => d)
      .catch((err) => {
        return { code: 500 };
      });

    return { code: _result.code, message: _result.message };
  }
};

const CheckTeamName = async (teamName: string) => {
  let _result = await fetch(
    `${import.meta.env.VITE_SERVER_PATH}game/check-team`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        teamName: teamName,
      }),
    }
  )
    .then((res) => res.json())
    .then((d) => d)
    .catch((err) => {
      return { code: 500 };
    });

  return { code: _result.code, message: _result.message };
};

const GetTeamName = async (params: any) => {
  let _result = await fetch(
    `${import.meta.env.VITE_SERVER_PATH}game/get-team-name`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ params }),
    }
  )
    .then((res) => res.json())
    .then((d) => d)
    .catch((err) => {
      return { code: 500 };
    });

  return { code: _result.code, items: _result.data };
};

export { GetTeamCard, SetTeam, CheckTeamName, GetTeamName };
