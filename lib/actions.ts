import { ProjectForm } from "@/common.types";
import { createLike, createProjectMutation, createUserMutation, deleteLikeMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, projectsQueryFiltered, updateProjectMutation, updateUserMutation, usersQuery } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production';

const apiUrl = isProduction ? 
  process.env.NEXT_PUBLIC_GRAFBASE_API_URL || "" :
  "http://127.0.0.1:4000/graphql"
const apiKey = isProduction ? 
  process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || "" :
  "";
const serverUrl = isProduction ? 
  process.env.NEXT_PUBLIC_SERVER_URL : 
  "http://localhost:3000";

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
}

export const getUser = (email: string) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getUserQuery, { email })
}

export const getUserList = (endCursor?: string) => {
  client.setHeader('x-api-key', apiKey);
  // client.setHeader('Authorization', `Bearer ${token}`);

  return makeGraphQLRequest(usersQuery, {
    endCursor
  })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader('x-api-key', apiKey)
  const variables = {
    input: {
      name, email, avatarUrl,
      description: "Hi! I`m a developer 👋"
    }
  }

  return makeGraphQLRequest(createUserMutation, variables)
}

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);

    return response.json();
  } catch (error) {
    throw error;
  }
}

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      body: JSON.stringify({ path: imagePath })
    })

    return response.json();
  } catch (error) {
    throw error;
  }
}

export const createNewProject = async (form: ProjectForm, 
  creatorId: string, token: string) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId
        }
      }
    }

    return makeGraphQLRequest(createProjectMutation, variables);
  }
}

export const likePost = async (projectId: string, creatorId: string,
  token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);

  const variables = {
    input: {
      user: {
        link: creatorId
      },
      project: {
        link: projectId
      }
    }
  }

  return makeGraphQLRequest(createLike, variables);
}

export const dislikePost = async (likeId: string,
  token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);

  return makeGraphQLRequest(deleteLikeMutation, { id: likeId });
}

export const fetchAllProjects = async (category?: string, endCursor?: string) => {
  client.setHeader('x-api-key', apiKey)

  if (category) {
    return makeGraphQLRequest(projectsQueryFiltered, {
      category: category || undefined,
      endCursor
    })
  } else {
    return makeGraphQLRequest(projectsQuery, {
      endCursor
    })
  }
}

export const getProjectDetails = (id: string) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getProjectByIdQuery, { id });
}

export const getUserProjects = (id: string, last?: number) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
}

export const deleteProject = (id: string, token: string) => {
  client.setHeader('Authorization', `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
}

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  function isBase64URL(value: string) {
    // Verificar se a string começa com "data:" seguido de uma sequência de caracteres base64
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = {...form};

  const isUploadingNewImage = isBase64URL(form.image);
  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image)

    if (imageUrl.url) {
      updatedForm = {
        ...form,
        image: imageUrl.url
      }
    }
  }
  const variables = {
    id: projectId,
    input: updatedForm
  }

  client.setHeader('Authorization', `Bearer ${token}`);
  return makeGraphQLRequest(updateProjectMutation, variables);
}

export const updateUser = async (email: string, username: string, description: string, token: string) => {
  client.setHeader('Authorization', `Bearer ${token}`);
  client.setHeader('x-api-key', apiKey)

  const variables = {
    email: email,
    input: {} as any
  };

  if (username) variables.input['name'] = username
  if (description) variables.input['description'] = description;

  console.log(variables)
  return makeGraphQLRequest(updateUserMutation, variables);
}