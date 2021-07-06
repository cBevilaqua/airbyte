/*
 * MIT License
 *
 * Copyright (c) 2020 Airbyte
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package io.airbyte.server;

import java.lang.reflect.Method;
import java.util.List;
import javax.annotation.security.PermitAll;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

@Provider
public class AuthenticationFilter implements ContainerRequestFilter {

  @Context
  private ResourceInfo resourceInfo;

  private static final String AUTHORIZATION_PROPERTY = "Authorization";
  private static final String AUTHENTICATION_SCHEME = "Bearer";
  private static final String ZOOX_EYE_URL = "http://192.168.1.2:4000/api/validate-token";
  private Client client = ClientBuilder.newClient();

  @Override
  public void filter(ContainerRequestContext requestContext) {
    Method method = resourceInfo.getResourceMethod();

    // Access allowed for all
    if (!method.isAnnotationPresent(PermitAll.class)) {
      // Get request headers
      final MultivaluedMap<String, String> headers = requestContext.getHeaders();

      // Fetch authorization header
      final List<String> authorization = headers.get(AUTHORIZATION_PROPERTY);

      // If no authorization information present; block access
      if (authorization == null || authorization.isEmpty()) {
        requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
            .entity("Unauthorized").build());
        return;
      }

      if (!isUserAllowed(authorization.get(0))) {
        requestContext
            .abortWith(Response.status(Response.Status.UNAUTHORIZED)
                .entity("Unauthorized")
                .build());
        return;
      }
    }
  }

  private boolean isUserAllowed(final String token) {
    Response resp = client.target(ZOOX_EYE_URL).path("/").request(MediaType.APPLICATION_JSON).header("Authorization", token).get();
    return resp.getStatus() == 200;
  }
}
