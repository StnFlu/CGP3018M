#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <vector>

//include shape, shader header files
#include "GLerror.h"
#include "SDL_Start.h"
#include "Triangle.h"
#include "Circle.h"
#ifndef SHADERCLASS_H
#define SHADERCLASS_H

// // GLEW - OpenGL Extension Wrangler - http://glew.sourceforge.net/
// // NOTE: include before SDL.h
#ifndef GLEW_H
#define GLEW_H
//#include <GL/glew.h>
#include "windows.h"

// SDL - Simple DirectMedia Layer - https://www.libsdl.org/
#ifndef SDL_H
#define SDL_H
#include "SDL.h"
//#include "SDL_image.h"
//#include "SDL_mixer.h"
//#include "SDL_ttf.h"

// // - OpenGL Mathematics - https://glm.g-truc.net/
#define GLM_FORCE_RADIANS // force glm to use radians
// // NOTE: must do before including GLM headers
// // NOTE: GLSL uses radians, so will do the same, for consistency
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>



int main(int argc, char *argv[]) {
	//start and initialise SDL
	SDL_Start sdl;
	SDL_GLContext context = sdl.Init();

	//error class
	GLerror glerr;
	int errorLabel;

	//GLEW initialise
	glewExperimental = GL_TRUE;
	GLenum err = glewInit();

	//register debug callback
	if (glDebugMessageCallback)
	{

		std::cout << "Registering OpenGL Debug callback function" << std::endl;
		glDebugMessageCallback(glerr.openglCallbackFunction, &errorLabel);
		glDebugMessageControl(GL_DONT_CARE,
			GL_DONT_CARE,
			GL_DONT_CARE,
			0,
			NULL,
			true);
	}

	//*****************************************************
	//OpenGL specific data
	//create triangle
	Triangle tri;

	errorLabel = 0;

	//OpenGL buffers
	tri.setBuffers();

	errorLabel = 3;
	//***********************************************

	SDL_Event event;
	bool windowOpen = true;

	//set up he 'uTime' uniform which sends
	//a time value from the main program to the shaders
	GLfloat currentTime;
	int timeLocation;

	//*****************************
	//'game' loop
	while (windowOpen)
	{

		//****************************
		// OpenGL calls.
		
		glClearColor(1.0f, 1.0f, 1.0f, 1);
		glClear(GL_COLOR_BUFFER_BIT); 

		errorLabel = 4;

		glUseProgram(tri.shaderProgram1);
		//set uniform variable value in shader
		currentTime = SDL_GetTicks();
		//get the 'uTime' uniform variable location
		timeLocation = glGetUniformLocation(tri.shaderProgram1, "uTime");
		//set the 'uTime' uniform variable in the shader with 'currentTime'
		glProgramUniform1f(tri.shaderProgram1, timeLocation, currentTime);

		glBindVertexArray(tri.VAO);
		tri.render();

		//set to wireframe so we can see the circles
		//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);


		SDL_GL_SwapWindow(sdl.win);

		//*****************************
		//SDL handled input
		//Any input to the program is done here

		
			if (SDL_PollEvent(&event))
			{
				if (event.type == SDL_QUIT)
				{
					windowOpen = false;
				}
			}
		

	}
	//****************************
	// Once finished with OpenGL functions, the SDL_GLContext can be deleted.
	SDL_GL_DeleteContext(context);

	SDL_Quit();
	return 0;





}
#endif
#endif
#endif