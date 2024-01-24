// NOTE: ../index.mdx depends on line numbers in this file.

import type { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs.mjs";
import type { FunctionDefinition } from "openai/resources/shared.mjs";
import { assert } from "./util";

const methodFunctions = [
  {
    name: "clearRect",
    description:
      "The CanvasRenderingContext2D.clearRect() method clears the specified rectangular area, making it fully transparent.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description:
            "The x-axis coordinate of the rectangle's starting point.",
        },
        y: {
          type: "number",
          description:
            "The y-axis coordinate of the rectangle's starting point.",
        },
        width: { type: "number", description: "The rectangle's width." },
        height: { type: "number", description: "The rectangle's height." },
      },
      required: ["x", "y", "width", "height"],
    },
  },
  {
    name: "fillRect",
    description:
      "The CanvasRenderingContext2D.fillRect() method draws a filled rectangle at the specified coordinates.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description:
            "The x-axis coordinate of the rectangle's starting point.",
        },
        y: {
          type: "number",
          description:
            "The y-axis coordinate of the rectangle's starting point.",
        },
        width: { type: "number", description: "The rectangle's width." },
        height: { type: "number", description: "The rectangle's height." },
      },
      required: ["x", "y", "width", "height"],
    },
  },
  {
    name: "beginPath",
    description:
      "The CanvasRenderingContext2D.beginPath() method starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.",
    // parameters: {},
  },
  {
    name: "arc",
    description:
      "The CanvasRenderingContext2D.arc() method creates a circular arc centered at (x, y) with a specified radius.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description: "The x-axis coordinate of the arc's center.",
        },
        y: {
          type: "number",
          description: "The y-axis coordinate of the arc's center.",
        },
        radius: { type: "number", description: "The arc's radius." },
        startAngle: {
          type: "number",
          description:
            "The angle at which the arc starts, measured clockwise from the positive x-axis.",
        },
        endAngle: {
          type: "number",
          description:
            "The angle at which the arc ends, measured clockwise from the positive x-axis.",
        },
        anticlockwise: {
          type: "boolean",
          description:
            "An optional boolean. If true, draws the arc counterclockwise between the start and end angles. The default is false (clockwise).",
        },
      },
      required: ["x", "y", "radius", "startAngle", "endAngle"],
    },
  },
  {
    name: "stroke",
    description:
      "The CanvasRenderingContext2D.stroke() method strokes the current or given path with the current stroke style.",
    // parameters: {},
  },
  {
    name: "moveTo",
    description:
      "The CanvasRenderingContext2D.moveTo() method moves the starting point of a new sub-path to the (x, y) coordinates.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description: "The x-axis coordinate of the point.",
        },
        y: {
          type: "number",
          description: "The y-axis coordinate of the point.",
        },
      },
      required: ["x", "y"],
    },
  },
  {
    name: "lineTo",
    description:
      "The CanvasRenderingContext2D.lineTo() method connects the last point in the current path to the specified (x, y) coordinates with a straight line.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description: "The x-axis coordinate of the endpoint.",
        },
        y: {
          type: "number",
          description: "The y-axis coordinate of the endpoint.",
        },
      },
      required: ["x", "y"],
    },
  },
  {
    name: "closePath",
    description:
      "The CanvasRenderingContext2D.closePath() method adds a straight line to the path, going to the start of the current sub-path.",
    // parameters: {},
  },
  {
    name: "fill",
    description:
      "The CanvasRenderingContext2D.fill() method fills the current or given path with the current fill style.",
    // parameters: {},
  },
  {
    name: "strokeRect",
    description:
      "The CanvasRenderingContext2D.strokeRect() method of the Canvas 2D API draws a rectangle that is stroked (outlined) according to the current stroke style and other context settings.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description:
            "The x-axis coordinate of the rectangle's starting point.",
        },
        y: {
          type: "number",
          description:
            "The y-axis coordinate of the rectangle's starting point.",
        },
        width: {
          type: "number",
          description:
            "The width of the rectangle, in pixels. Positive values are to the right.",
        },
        height: {
          type: "number",
          description:
            "The height of the rectangle, in pixels. Positive values are downward.",
        },
      },
      required: ["x", "y", "width", "height"],
    },
  },
  {
    name: "bezierCurveTo",
    description:
      "The CanvasRenderingContext2D.bezierCurveTo() method of the Canvas 2D API adds a cubic Bézier curve to the current path. It requires three points. The first two points are control points and the third one is the end point. The starting point is the latest point in the current path, which can be changed using moveTo() before creating the Bézier curve.",
    parameters: {
      type: "object",
      properties: {
        cp1x: {
          type: "number",
          description: "The x-axis coordinate of the first control point.",
        },
        cp1y: {
          type: "number",
          description: "The y-axis coordinate of the first control point.",
        },
        cp2x: {
          type: "number",
          description: "The x-axis coordinate of the second control point.",
        },
        cp2y: {
          type: "number",
          description: "The y-axis coordinate of the second control point.",
        },
        x: {
          type: "number",
          description: "The x-axis coordinate of the end point.",
        },
        y: {
          type: "number",
          description: "The y-axis coordinate of the end point.",
        },
      },
      required: ["cp1x", "cp1y", "cp2x", "cp2y", "x", "y"],
    },
  },
  {
    name: "quadraticCurveTo",
    description:
      "The CanvasRenderingContext2D.quadraticCurveTo() method of the Canvas 2D API adds a quadratic Bézier curve to the current path. It requires two points. The first point is a control point and the second one is the end point. The starting point is the latest point in the current path, which can be changed using moveTo() before creating the quadratic Bézier curve.",
    parameters: {
      type: "object",
      properties: {
        cpx: {
          type: "number",
          description: "The x-axis coordinate of the control point.",
        },
        cpy: {
          type: "number",
          description: "The y-axis coordinate of the control point.",
        },
        x: {
          type: "number",
          description: "The x-axis coordinate of the end point.",
        },
        y: {
          type: "number",
          description: "The y-axis coordinate of the end point.",
        },
      },
      required: ["cpx", "cpy", "x", "y"],
    },
  },
  {
    name: "arcTo",
    description:
      "The CanvasRenderingContext2D.arcTo() method of the Canvas 2D API adds an arc to the path with the given control points and radius, connected to the previous point by a straight line.",
    parameters: {
      type: "object",
      properties: {
        x1: {
          type: "number",
          description: "The x-axis coordinate of the first control point.",
        },
        y1: {
          type: "number",
          description: "The y-axis coordinate of the first control point.",
        },
        x2: {
          type: "number",
          description: "The x-axis coordinate of the second control point.",
        },
        y2: {
          type: "number",
          description: "The y-axis coordinate of the second control point.",
        },
        radius: {
          type: "number",
          description: "The arc's radius. Must be non-negative.",
        },
      },
      required: ["x1", "y1", "x2", "y2", "radius"],
    },
  },
  {
    name: "ellipse",
    description:
      "The CanvasRenderingContext2D.ellipse() method of the Canvas 2D API adds an ellipse to the path which is centered at (x, y) position with the radii radiusX and radiusY starting at startAngle and ending at endAngle going in the given direction by anticlockwise (defaulting to clockwise).",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description: "The x-axis coordinate of the ellipse's center.",
        },
        y: {
          type: "number",
          description: "The y-axis coordinate of the ellipse's center.",
        },
        radiusX: {
          type: "number",
          description: "The ellipse's major-axis radius. Must be non-negative.",
        },
        radiusY: {
          type: "number",
          description: "The ellipse's minor-axis radius. Must be non-negative.",
        },
        rotation: {
          type: "number",
          description: "The rotation of the ellipse, expressed in radians.",
        },
        startAngle: {
          type: "number",
          description:
            "The angle at which the ellipse starts, measured clockwise from the positive x-axis and expressed in radians.",
        },
        endAngle: {
          type: "number",
          description:
            "The angle at which the ellipse ends, measured clockwise from the positive x-axis and expressed in radians.",
        },
        anticlockwise: {
          type: "boolean",
          description:
            "An optional Boolean which, if true, draws the ellipse anticlockwise (counter-clockwise). The default value is false (clockwise).",
        },
      },
      required: [
        "x",
        "y",
        "radiusX",
        "radiusY",
        "rotation",
        "startAngle",
        "endAngle",
      ],
    },
  },
  {
    name: "roundRect",
    description:
      "The CanvasRenderingContext2D.roundRect() method of the Canvas 2D API adds a rounded rectangle to the current path. It allows for the drawing of rectangles with rounded corners.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description:
            "The x-axis coordinate of the rectangle's starting point, in pixels.",
        },
        y: {
          type: "number",
          description:
            "The y-axis coordinate of the rectangle's starting point, in pixels.",
        },
        width: {
          type: "number",
          description:
            "The rectangle's width. Positive values are to the right, and negative to the left.",
        },
        height: {
          type: "number",
          description:
            "The rectangle's height. Positive values are down, and negative are up.",
        },
        radius: {
          type: "number",
          description:
            "The radius of the rectangle's corners. Can be a single value for uniform radius, or an object specifying individual radii for each corner.",
        },
      },
      required: ["x", "y", "width", "height", "radius"],
    },
  },
] as const satisfies Readonly<FunctionDefinition[]>;

const propertyFunctions = [
  {
    name: "fillStyle",
    description:
      "The CanvasRenderingContext2D.fillStyle property of the Canvas 2D API specifies the color, gradient, or pattern to use inside shapes. The default style is #000 (black).",
    parameters: {
      type: "object",
      properties: {
        fillStyle: {
          type: "string",
          description:
            "A DOMString parsed as CSS <color> value, a CanvasGradient object, or a CanvasPattern object. It defines the color, gradient, or pattern to use inside shapes.",
        },
      },
      required: ["fillStyle"],
    },
  },
  {
    name: "strokeStyle",
    description:
      "The CanvasRenderingContext2D.strokeStyle property of the Canvas 2D API specifies the color, gradient, or pattern to use for the strokes (outlines) around shapes. The default is #000 (black).",
    parameters: {
      type: "object",
      properties: {
        strokeStyle: {
          type: "string",
          description:
            "A DOMString parsed as CSS <color> value, a CanvasGradient object, or a CanvasPattern object. It defines the color, gradient, or pattern to use for the strokes around shapes.",
        },
      },
      required: ["strokeStyle"],
    },
  },
  {
    name: "lineWidth",
    description:
      "The CanvasRenderingContext2D.lineWidth property of the Canvas 2D API sets or returns the current line width used for stroking paths. The default line width is 1.0 units.",
    parameters: {
      type: "object",
      properties: {
        lineWidth: {
          type: "number",
          description:
            "A number specifying the width of lines drawn in the future. Values must be positive and are in units of the coordinate space.",
        },
      },
      required: ["lineWidth"],
    },
  },
] as const satisfies Readonly<FunctionDefinition[]>;

export const getAssistantTools = () =>
  [...propertyFunctions, ...methodFunctions].map(tool => ({
    type: "function" as const,
    function: tool,
  }));

type CanvasProperty = (typeof propertyFunctions)[number];
type CanvasMethod = (typeof methodFunctions)[number];

export class CanvasTools {
  constructor(
    // eslint-disable-next-line no-unused-vars
    public width: number,
    // eslint-disable-next-line no-unused-vars
    public height: number,
    // eslint-disable-next-line no-unused-vars
    protected ctx: CanvasRenderingContext2D
  ) {}

  protected static readonly properties = propertyFunctions.reduce(
    (properties: Record<string, CanvasProperty | undefined>, property) => ({
      ...properties,
      [property.name]: property,
    }),
    {}
  );

  protected static readonly methods = methodFunctions.reduce(
    (methods: Record<string, CanvasMethod | undefined>, method) => ({
      ...methods,
      [method.name]: method,
    }),
    {}
  );

  private parseParams(
    fn: RequiredActionFunctionToolCall.Function
  ): Record<string, unknown> {
    if (fn.arguments === "") {
      return {};
    }
    try {
      const args = fn.arguments
        .replace(/[\d\s.*/+-]*Math\.PI[\d\s.*/+-]*/g, match => `${eval(match)}`)
        .replace(/[\d\s.*/+-]*[*/+-]+[\d\s.*/+-]*/g, match => `${eval(match)}`);
      const data = JSON.parse(args);
      assert(
        typeof data === "object",
        `parseParams: unexpected non-object ${args}`
      );
      return data;
    } catch (error) {
      console.error(`[tools] JSON.parse error`, fn);
      throw error;
    }
  }

  call(fn: RequiredActionFunctionToolCall.Function) {
    const params = this.parseParams(fn);

    const property = CanvasTools.properties[fn.name];
    if (property) {
      this.setProperty(property, params);
      return;
    }

    const method = CanvasTools.methods[fn.name];
    if (method) {
      this.callMethod(method, params);
      return;
    }

    throw new Error(`CanvasTools.call: unknown property/method ${fn.name}`);
  }

  protected log(message: string) {
    console.debug(`[tools] ${message}]`);
  }

  private setProperty(
    property: CanvasProperty,
    params: Record<string, unknown>
  ) {
    const keys = Object.keys(params);
    let value: string | undefined;

    if (keys.length !== 0) {
      assert(
        keys.length === 1,
        `setProperty: unexpected number of arguments ${keys.length}: ${keys}`
      );
      value = params[property.name] as string;
    }
    this.log(`${property.name} = ${value}`);
    // @ts-expect-error
    this.ctx[property.name] = value;
  }

  private callMethod(method: CanvasMethod, params: Record<string, unknown>) {
    let args: unknown[] = [];
    if ("parameters" in method) {
      args = Object.keys(method.parameters.properties).map(name => {
        const value = params[name];
        const isRequired = (
          method.parameters.required as readonly string[]
        ).includes(name);
        assert(
          !isRequired || value !== undefined,
          `callMethod: ${method.name} missing required parameter ${name}`
        );
        return value;
      });
    }

    this.log(`${method.name}(${args.join(", ")})`);
    // @ts-expect-error
    this.ctx[method.name](...args);
  }
}
