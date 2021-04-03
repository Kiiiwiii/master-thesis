# Install script for directory: /Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/include/ifcparse/Ifc4-latebound.h;/usr/local/include/ifcparse/Ifc4.h;/usr/local/include/ifcparse/Ifc4enum.h;/usr/local/include/ifcparse/IfcCharacterDecoder.h;/usr/local/include/ifcparse/IfcEntityDescriptor.h;/usr/local/include/ifcparse/IfcException.h;/usr/local/include/ifcparse/IfcFile.h;/usr/local/include/ifcparse/IfcGlobalId.h;/usr/local/include/ifcparse/IfcHierarchyHelper.h;/usr/local/include/ifcparse/IfcLateBoundEntity.h;/usr/local/include/ifcparse/IfcLogger.h;/usr/local/include/ifcparse/IfcParse.h;/usr/local/include/ifcparse/IfcParse_Export.h;/usr/local/include/ifcparse/IfcSIPrefix.h;/usr/local/include/ifcparse/IfcSpfHeader.h;/usr/local/include/ifcparse/IfcSpfStream.h;/usr/local/include/ifcparse/IfcUtil.h;/usr/local/include/ifcparse/IfcWritableEntity.h;/usr/local/include/ifcparse/IfcWrite.h")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/include/ifcparse" TYPE FILE FILES
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/Ifc4-latebound.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/Ifc4.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/Ifc4enum.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcCharacterDecoder.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcEntityDescriptor.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcException.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcFile.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcGlobalId.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcHierarchyHelper.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcLateBoundEntity.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcLogger.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcParse.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcParse_Export.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcSIPrefix.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcSpfHeader.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcSpfStream.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcUtil.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcWritableEntity.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcparse/IfcWrite.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/include/ifcgeom/IfcGeom.h;/usr/local/include/ifcgeom/IfcGeomElement.h;/usr/local/include/ifcgeom/IfcGeomIterator.h;/usr/local/include/ifcgeom/IfcGeomIteratorSettings.h;/usr/local/include/ifcgeom/IfcGeomMaterial.h;/usr/local/include/ifcgeom/IfcGeomRenderStyles.h;/usr/local/include/ifcgeom/IfcGeomRepresentation.h;/usr/local/include/ifcgeom/IfcGeomShapeType.h;/usr/local/include/ifcgeom/IfcRegister.h;/usr/local/include/ifcgeom/IfcRegisterConvertCurve.h;/usr/local/include/ifcgeom/IfcRegisterConvertFace.h;/usr/local/include/ifcgeom/IfcRegisterConvertShape.h;/usr/local/include/ifcgeom/IfcRegisterConvertShapes.h;/usr/local/include/ifcgeom/IfcRegisterConvertWire.h;/usr/local/include/ifcgeom/IfcRegisterCreateCache.h;/usr/local/include/ifcgeom/IfcRegisterDef.h;/usr/local/include/ifcgeom/IfcRegisterGeomHeader.h;/usr/local/include/ifcgeom/IfcRegisterPurgeCache.h;/usr/local/include/ifcgeom/IfcRegisterShapeType.h;/usr/local/include/ifcgeom/IfcRegisterUndef.h;/usr/local/include/ifcgeom/IfcRepresentationShapeItem.h")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/include/ifcgeom" TYPE FILE FILES
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeom.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeomElement.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeomIterator.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeomIteratorSettings.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeomMaterial.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeomRenderStyles.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeomRepresentation.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcGeomShapeType.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegister.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterConvertCurve.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterConvertFace.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterConvertShape.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterConvertShapes.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterConvertWire.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterCreateCache.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterDef.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterGeomHeader.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterPurgeCache.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterShapeType.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRegisterUndef.h"
    "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/../src/ifcgeom/IfcRepresentationShapeItem.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/lib/libIfcParse.a")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/lib" TYPE STATIC_LIBRARY FILES "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/libIfcParse.a")
  if(EXISTS "$ENV{DESTDIR}/usr/local/lib/libIfcParse.a" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}/usr/local/lib/libIfcParse.a")
    execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ranlib" "$ENV{DESTDIR}/usr/local/lib/libIfcParse.a")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/lib/libIfcGeom.a")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/lib" TYPE STATIC_LIBRARY FILES "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/libIfcGeom.a")
  if(EXISTS "$ENV{DESTDIR}/usr/local/lib/libIfcGeom.a" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}/usr/local/lib/libIfcGeom.a")
    execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ranlib" "$ENV{DESTDIR}/usr/local/lib/libIfcGeom.a")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/bin/IfcConvert")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/bin" TYPE EXECUTABLE FILES "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/IfcConvert")
  if(EXISTS "$ENV{DESTDIR}/usr/local/bin/IfcConvert" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}/usr/local/bin/IfcConvert")
    if(CMAKE_INSTALL_DO_STRIP)
      execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/strip" "$ENV{DESTDIR}/usr/local/bin/IfcConvert")
    endif()
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/bin/IfcGeomServer")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/bin" TYPE EXECUTABLE FILES "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/IfcGeomServer")
  if(EXISTS "$ENV{DESTDIR}/usr/local/bin/IfcGeomServer" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}/usr/local/bin/IfcGeomServer")
    if(CMAKE_INSTALL_DO_STRIP)
      execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/strip" "$ENV{DESTDIR}/usr/local/bin/IfcGeomServer")
    endif()
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "/Users/Zhan_/Desktop/IfcOpenShell-1-master/cmake/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
